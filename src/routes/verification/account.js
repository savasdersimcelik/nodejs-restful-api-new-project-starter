const { user } = require('../../models');
const { joi_error_message, joi, config } = require('../../util')
const { date, generate_random_code, netgsm, mail } = require('../../helpers');
const { verification_mail_template } = require('../../templates');
const CryptoJS = require('crypto-js')

/** 
 * Kullanıcı hesap doğrulaması için şema
 */
const scheme = joi.object({
    key: joi.string().required().label('KEY'),                              // Kullanıcı eposta adresi
    code: joi.string().required().label('Doğrulama Kodu'),                  // Kullanıcı gönderilen kod
}).options({ stripUnknown: true }).error(joi_error_message);

const route = async (req, res) => {
    let { query, body, params } = req;

    const unix_time = await date.unixTime();                               // Unix Time

    var decrypt_key = null;
    try {
        const bytes = CryptoJS.AES.decrypt(body.key, config.secretKey);         // Kullanıcıdan gelen KEY çözümlüyor.
        decrypt_key = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));      // Çöüzmlenen değer UTF-8 olarak string hale getiriliyor
    } catch (error) {
        return res.error(500, "Bilinmeyen bir hata meydana geldi.");
    }

    if (!decrypt_key._id) {

        /** Gelen key içerisinde _id var mı kontrol eder. Yoksa Hata mesajı döner */
        return res.error(500, "Bilinmeyen bir hata meydana geldi.");
    }

    if (!decrypt_key.type && (decrypt_key.type != 'email' || decrypt_key.type != 'phone')) {
        /** Gelen key içerisinde type var mı kontrol eder. Yoksa Hata mesajı döner */
        return res.error(500, "Bilinmeyen bir hata meydana geldi. Lütfen tekrar deneyin.");
    }

    const code_query = decrypt_key.type == 'phone' ?                        // Doğrulama kodu türü kontrol ediliyor.
        { 'verification.phone_code': body.code }                            // Doğrulama kodu telefon ise telefon kodu atanıyor.
        : { 'verification.email_code': body.code }                          // Doğrulama kodu eposta ise eposta kodu atanıyor. 

    /** Veritabanında key, _id ve doğrulama kodu eşleşen kişi var mı kontor ediliyor. */
    let _user = await user.findOne({ 'verification.key': body.key, _id: decrypt_key._id, ...code_query })
        .select("+verification.phone_expiration").select("+verification.email_expiration");
    if (!_user) {

        /** Kullanıcı yoksa hata mesaj döner */
        return res.error(422, "Geçersiz bir kod gönderdiniz. Lütfen tekrar deneyin.");
    }

    /** type Eposta adresi ise ve doğrulama kodunun son kullanım tarihi geçmiş mi diye kontrol eder */
    if (decrypt_key.type == 'email' && _user.verification.email_expiration < unix_time) {

        /** Doğrulama kodunun süresi dolmuş ise hata mesajı döner */
        return res.error(422, "Doğrulama kodunuzun süresi dolmuş. Lütfen tekrar deneyin");
    }

    /** type Telefon ise ve doğrulama kodunun son kullanım tarihi geçmiş mi diye kontrol eder */
    if (decrypt_key.type == 'phone' && _user.verification.phone_expiration < unix_time) {

        /** Doğrulama kodunun süresi dolmuş ise hata mesajı döner */
        return res.error(422, "Doğrulama kodunuzun süresi dolmuş. Lütfen tekrar deneyin");
    }

    verify_type = decrypt_key.type == 'phone' ? 'email' : 'phone';
    /** Şifre değişikliği için hash oluşturuyor ve  Datalar JSON formatına dönüştürülüyor. */
    const data_stringify = JSON.stringify({ _id: _user._id, type: verify_type });

    let data = new Object();    // Yeni bir object oluşturuluyor.
    data.verification = {};     // Object içerisinde yeni bir boş object daha tanımlıyor.

    /** Özel Anahtar oluşturuluyor */
    data.verification.key = CryptoJS.AES.encrypt(data_stringify, config.secretKey).toString();

    /** Telefon için doğrulama kodu üretir */
    data.verification.phone_code = await generate_random_code(6, true);

    /** Doğrulama kodu için son kullanma tarihi üretir */
    data.verification.phone_expiration = await date.getTimeAdd(config.verification.expiration_time);

    /** Eposta için doğrulama kodu üretir */
    data.verification.email_code = await generate_random_code(6, true);

    /** Doğrulama kodu için son kullanma tarihi üretir */
    data.verification.email_expiration = await date.getTimeAdd(config.verification.expiration_time);

    if (decrypt_key.type == 'phone') {
        data.is_active = _user.verification.email_verifyed && config.verification.required ? true : false;
        data.verification.phone_verifyed = true;                                // Doğrulama başarılı işlemi
        data.verification.phone_verifyed_date = await date.toISOString();       // Doğrulama tarihi
    } else if (decrypt_key.type == 'email') {
        data.is_active = _user.verification.phone_verifyed && config.verification.required ? true : false;
        data.verification.email_verifyed = true;                                // Doğrulama başarılı işlemi
        data.verification.email_verifyed_date = await date.toISOString();       // Doğrulama tarihi
    } else {

        /** Doğrulama kodunun süresi dolmuş ise hata mesajı döner */
        return res.error(422, "Bilinmeyen bir hata meydana geldi. Lütfen tekrar deneyin.");
    }

    _user.set(data);
    _user = await _user.save();

    if (config.verification.required && config.verification.email && !_user.verification.email_verifyed) {

        await mail.send({                                   // Kullanıcıya mail gönderir
            name: _user.name,                               // Kullanıcı eposta adresi
            email: _user.email,                             // Kullanıcı eposta adresi
            subject: 'Eposta Doğrulama',                    // Mail Başlığı
            html: await verification_mail_template({        // Mail template
                code: _user.verification.email_code,        // Doğrulama kodu
                name: _user.name                            // Kullanıcının tam adı
            })
        });

        /** Doğrulama kodu değiştirilirse başarılı response döner */
        return res.respond({ key: _user.verification.key }, "Eposta adresinizi doğrulamanız gerekmektedir.");
    }

    if (config.verification.required && config.verification.phone && !_user.verification.phone_verifyed) {

        await netgsm.send({                                 // Kullanıcıya SMS gönderir
            user: _user._id,                                // SMS gönderilen kullanıcı ID
            created_by: _user._id,                          // SMS gönderen kullanıcı ID
            gsmno: _user.phone,                             // SMS gönderilen kullanıcı telefon numarası
            type: 'register',                               // SMS Mesaj içeriği türü
            code: _user.verification.phone_code             // Gönderilen doğrulama kodu
        });

        /** Doğrulama kodu değiştirilirse başarılı response döner */
        return res.respond({ key: _user.verification.key }, "Telefon numaranızı doğrulamanız gerekmektedir.");
    }

    /** Doğrulama kodu değiştirilirse başarılı response döner */
    return res.respond({}, "Doğrulama işlemleri tamamlandı artık giriş yapabilirsiniz.");

}

module.exports = {
    scheme,
    route
}