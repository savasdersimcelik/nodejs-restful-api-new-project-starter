const { user } = require('../../models');
const { joi_error_message, joi, config } = require('../../util')
const { date } = require('../../helpers');
const CryptoJS = require('crypto-js')

/** 
 * Kullanıcı şifre sıfırlama doğrulama kodu şeması
 */
const scheme = joi.object({
    key: joi.string().required().label('KEY'),                              // Kullanıcı eposta adresi
    code: joi.string().required().label('Doğrulama Kodu'),                  // Kullanıcı gönderilen kod
}).options({ stripUnknown: true }).error(joi_error_message);

const route = async (req, res) => {
    let { query, body, params } = req;

    const unix_time = await date.unixTime();                                // Unix Time
    
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
    
    if (decrypt_key.type && decrypt_key.type != 'forgot') {

        /** Gelen key içerisinde type var mı kontrol eder. Yoksa Hata mesajı döner */
        return res.error(500, "Bilinmeyen bir hata meydana geldi. Lütfen tekrar deneyin.");
    }

    /** Veritabanında key, _id ve doğrulama kodu eşleşen kişi var mı kontor ediliyor. */
    let _user = await user.findOne({ 'verification.key': body.key, _id: decrypt_key._id, 'verification.forgot_code': body.code })
        .select("+verification.forgot_expiration");
    if (!_user) {

        /** Kullanıcı yoksa hata mesaj döner */
        return res.error(422, "Geçersiz bir kod gönderdiniz. Lütfen tekrar deneyin.");
    }

    /** type Eposta adresi ise ve doğrulama kodunun son kullanım tarihi geçmiş mi diye kontrol eder */
    if (_user.verification.forgot_expiration < unix_time) {

        /** Doğrulama kodunun süresi dolmuş ise hata mesajı döner */
        return res.error(422, "Doğrulama kodunuzun süresi dolmuş. Lütfen tekrar deneyin");
    }

    /** 
    * Şifre değişikliği için hash oluşturuyor.
    * Datalar JSON formatına dönüştürülüyor.
    */
    const data_stringify = JSON.stringify({ _id: _user._id, type: decrypt_key.type, expiration: await date.getTimeAdd(config.forgot.expiration_time) });

    /** Özel Anahtar Oluşturuluyor */
    const verification_key = CryptoJS.AES.encrypt(data_stringify, config.secretKey);

    _user.set({
        verification: {
            key: verification_key.toString()            // Yeni şifremi unuttum HASH'i
        }
    });
    _user = await _user.save();                         // Değişiklikleri kayıt ediyoruz.

    if (_user) {
        
        /** Doğrulama kodu değiştirilirse başarılı response döner */
        return res.respond({ key: _user.verification.key }, "Artık şifrenizi değiştirebilirsiniz.");
    }

    /** Kayıt işlemi gerçekleşmezse hata mesajı döner. */
    return res.error(500, "Bir hata meydana geldi. Lütfen tekrar deneyin");
}

module.exports = {
    scheme,
    route
}