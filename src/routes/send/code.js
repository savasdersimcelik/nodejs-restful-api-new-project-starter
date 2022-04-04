const { user } = require('../../models');
const { joi, joi_error_message, config } = require('../../util');
const { date, generate_random_code, netgsm, mail } = require('../../helpers');
const { verification_mail_template } = require('../../templates');
const CryptoJS = require('crypto-js')

/** 
 * Doğrulama kodunu tekrar gönderilmesi için şema
 */
const scheme = joi.object({
    key: joi.string().required().label('KEY')
}).options({ stripUnknown: true }).error(joi_error_message);

const route = async (req, res) => {
    let { body, query, params, client } = req;
    const unixTime = await date.unixTime();                                 // Unix Time Değeri

    const bytes = CryptoJS.AES.decrypt(body.key, config.secretKey);         // Kullanıcıdan gelen KEY çözümlüyor.
    const decrypt_key = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));      // Çöüzmlenen değer UTF-8 olarak string hale getiriliyor.

    /** Özel anahtar içerisinde ki doğrulama türünü kontrol eder. */
    if (!decrypt_key._id) {

        /** Gelen key içerisinde type var mı kontrol eder. Yoksa Hata mesajı döner */
        return res.error(500, "Bilinmeyen bir hata meydana geldi. Lütfen tekrar deneyin.");
    }

    /** Veritabanında özel anahtar içerisindeki ID değerine ve Özel Anahtara göre sorgu yapar. */
    let _user = await user.findOne({ _id: decrypt_key._id, 'verification.key': body.key })
        .select("+verification.email_expiration").select("+verification.phone_expiration").select("+verification.forgot_expiration");
    if (!_user) {

        /**  Kullanıcı yoksa hata mesaj döner */
        return res.error(400, "Böyle bir kullanıcı bulunamadı. Lütfen bilgilerinizi kontrol edin.");
    }

    /** Özel anahtar içerisinde ki doğrulama türünü kontrol eder. */
    if (!decrypt_key.type && (decrypt_key.type != 'email' || decrypt_key.type != 'phone' || decrypt_key.type != 'forgot')) {

        /** Gelen key içerisinde type var mı kontrol eder. Yoksa Hata mesajı döner */
        return res.error(500, "Bilinmeyen bir hata meydana geldi. Lütfen tekrar deneyin.");
    }

    /** Dataları JSON formatına dönüştürür */
    const data_stringify = JSON.stringify({ _id: _user._id, type: decrypt_key.type, expiration: await date.getTimeAdd(config.verification.expiration_time) });

    /** Özel Anahtar Oluşturuluyor */
    const verification_key = CryptoJS.AES.encrypt(data_stringify, config.secretKey);

    let data = new Object();                                    // Yeni bir obje yaratır
    if (decrypt_key.type == 'email') {                          // Doğrulama türünü kontrol eder
        if (_user.verification.email_expiration > unixTime) {   // Son kodun tarihi dolmuş mu kontrol eder.

            /**  Kullanıcı yoksa hata mesaj döner */
            return res.error(400, "Henüz doğrulama kodunuzun süresi dolmamış.");
        }

        data.verification = {
            key: verification_key.toString(),                   // Doğrulama işlemi için özel anahtar
            email_code: await generate_random_code(6, true),    // Eposta için doğrulama kodu üretir
            email_expiration: await date.getTimeAdd(config.verification.expiration_time),   // Doğrulama kodu geçerlilik süresi
        }
    }

    if (decrypt_key.type == 'phone') {                          // Doğrulama türünü kontrol eder
        if (_user.verification.phone_expiration > unixTime) {   // Son kodun tarihi dolmuş mu kontrol eder.

            /**  Kullanıcı yoksa hata mesaj döner */
            return res.error(400, "Henüz doğrulama kodunuzun süresi dolmamış.");
        }

        data.verification = {
            key: verification_key,                              // Doğrulama işlemi için özel anahtar
            phone_code: await generate_random_code(6, true),    // Telefon için doğrulama kodu üretir
            phone_expiration: await date.getTimeAdd(config.verification.expiration_time),   // Doğrulama kodu geçerlilik süresi
        }
    }

    if (decrypt_key.type == 'forgot') {                          // Doğrulama türünü kontrol eder
        if (_user.verification.forgot_expiration > unixTime) {   // Son kodun tarihi dolmuş mu kontrol eder.
            /**  Kullanıcı yoksa hata mesaj döner */
            return res.error(400, "Henüz doğrulama kodunuzun süresi dolmamış.");
        }

        data.verification = {
            key: verification_key,                              // Doğrulama işlemi için özel anahtar
            forgot_code: await generate_random_code(6, true),    // Telefon için doğrulama kodu üretir
            forgot_expiration: await date.getTimeAdd(config.verification.expiration_time),   // Doğrulama kodu geçerlilik süresi
        }
    }

    _user.set(data);
    _user = await _user.save();

    if (_user) {

        if (decrypt_key.type == 'phone') {
            if(config.required.phone){
                await netgsm.send({                                 // Kullanıcıya SMS gönderir
                    user: _user._id,                                // SMS gönderilen kullanıcı ID
                    created_by: _user._id,                          // SMS gönderen kullanıcı ID
                    gsmno: _user.phone,                             // SMS gönderilen kullanıcı telefon numarası
                    type: 'verification',                           // SMS Mesaj içeriği türü
                    code: _user.verification.phone_code             // Gönderilen doğrulama kodu
                });
            }else if(config.required.email){
                await mail.send({                                   // Kullanıcıya mail gönderir
                    name: _user.name,                               // Kullanıcı adı
                    email: _user.email,                             // Kullanıcı eposta adresi
                    subject: 'Doğrulama Kodu',                      // Mail Başlığı
                    html: await verification_mail_template({        // Mail template
                        code: _user.verification.email_code,        // Doğrulama kodu
                        name: _user.name                            // Kullanıcının tam adı
                    })
                });
            }
        }

        if (decrypt_key.type == 'email') {
            if(config.required.phone){
                await netgsm.send({                                 // Kullanıcıya SMS gönderir
                    user: _user._id,                                // SMS gönderilen kullanıcı ID
                    created_by: _user._id,                          // SMS gönderen kullanıcı ID
                    gsmno: _user.phone,                             // SMS gönderilen kullanıcı telefon numarası
                    type: 'verification',                           // SMS Mesaj içeriği türü
                    code: _user.verification.phone_code             // Gönderilen doğrulama kodu
                });
            }else if(config.required.email){
                await mail.send({                                   // Kullanıcıya mail gönderir
                    name: _user.name,                               // Kullanıcı adı
                    email: _user.email,                             // Kullanıcı eposta adresi
                    subject: 'Doğrulama Kodu',                      // Mail Başlığı
                    html: await verification_mail_template({        // Mail template
                        code: _user.verification.email_code,        // Doğrulama kodu
                        name: _user.name                            // Kullanıcının tam adı
                    })
                });
            }
        }

        if (decrypt_key.type == 'forgot') {
            if(config.required.phone){
                await netgsm.send({                                 // Kullanıcıya SMS gönderir
                    user: _user._id,                                // SMS gönderilen kullanıcı ID
                    created_by: _user._id,                          // SMS gönderen kullanıcı ID
                    gsmno: _user.phone,                             // SMS gönderilen kullanıcı telefon numarası
                    type: 'verification',                           // SMS Mesaj içeriği türü
                    code: _user.verification.phone_code             // Gönderilen doğrulama kodu
                });
            }else if(config.required.email){
                await mail.send({                                   // Kullanıcıya mail gönderir
                    name: _user.name,                               // Kullanıcı adı
                    email: _user.email,                             // Kullanıcı eposta adresi
                    subject: 'Doğrulama Kodu',                      // Mail Başlığı
                    html: await verification_mail_template({        // Mail template
                        code: _user.verification.forgot_code,       // Doğrulama kodu
                        name: _user.name                            // Kullanıcının tam adı
                    })
                });
            }
        }

        /** Doğrulama kodu tekrar gönderildi. */
        return res.respond({ key: _user.verification.key }, "Doğrulama kodunuz tekrar gönderildi.");
    }

    /** Kayıt işlemi gerçekleşmezse hata mesajı döner. */
    return res.error(500, "Bir hata meydana geldi. Lütfen tekrar deneyin");

}

module.exports = {
    scheme,
    route
}