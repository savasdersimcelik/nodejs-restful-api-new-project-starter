const { user } = require('../../models');
const { joi, joi_error_message, config } = require('../../util');
const { match_password, encode_token, date, generate_random_code, netgsm, mail } = require('../../helpers');
const { verification_mail_template } = require('../../templates');
const CryptoJS = require("crypto-js");
const _ = require('lodash');

/** 
 * Kullanıcı giriş yaparken uygulması gereken kurallar şeması
 */
const scheme = joi.object({
    email: joi.string().email().label('Email'),                                         // Kullanıcı eposta adresi
    phone: joi.string().label('Telefon'),                                               // Kullanıcı Telefon Numarası
    password: joi.string().min(6).max(20).required().label('Şifre'),                    // Kullanıcı Şifre
    lang: joi.string().empty("").label('Dil').default(config.defaultLang)               // İçerik dili belirler
}).options({ stripUnknown: true }).xor('email', 'phone').error(joi_error_message);      // Joi Ayarlar

const route = async (req, res) => {
    let { body, params, query } = req;

    var _user = null;
    if (body?.phone) {
        /** Gönderilen kullanıcı bilgileri ile ilgili veritabanında sorgu yapar */
        _user = await user.findOne({ phone: body.phone, is_delete: false }).select("+password");
    }

    if (!_user && body?.email) {
        /** Gönderilen kullanıcı bilgileri ile ilgili veritabanında sorgu yapar */
        _user = await user.findOne({ email: body.email, is_delete: false }).select("+password");
    }

    if (!_user) {
        /**  Kullanıcı yoksa hata mesaj döner */
        return res.error("not_found_user");
    }

    /** Sadece doğrulama işlemini tamamlamış kişiler mi giriş yapabilir kontrol ediyor. */
    if (config.verification.required) {

        /**
         * Hesap aktif edilmiş mi kontrol eder.
         * Eğer hesap aktif edilmemiş ise hangi cihaz aktif edilmemiş kontrol eder.
         */
        if (!_user.is_active) {

            /** Doğrulama işlemi nasıl gerçekleşecek */
            const verif_type = _user.verification.phone_verifyed ? 'email' : 'phone';

            /** Doğrulama işlemi için özel anahtar oluşturur */
            const data_stringify = JSON.stringify({ _id: _user._id, type: verif_type, expiration: await date.getTimeAdd(config.verification.expiration_time) });

            /** Özel anahtarı oluşturuluyor. */
            const verification_key = CryptoJS.AES.encrypt(data_stringify, config.secretKey);

            _user.set({                                     // Kullanıcı yeni datalarını set eder
                verification: {
                    key: verification_key.toString(),                                               // Doğrulama kodu için üretilen hash
                    phone_code: await generate_random_code(6, true),                                // 6 Haneli bir şifre oluşturuluyor.
                    phone_expiration: await date.getTimeAdd(config.verification.expiration_time),   // Doğrulama kodunun geçerlilik süresi oluşturuluyor.
                    email_code: await generate_random_code(6, true),                                // 6 Haneli bir şifre oluşturuluyor.
                    email_expiration: await date.getTimeAdd(config.verification.expiration_time),   // Doğrulama kodunun geçerlilik süresi oluşturuluyor.
                }
            });
            _save = await _user.save();                     // Yeni datalar sisteme ekleniyor.

            /** Telefon doğrulama işlemi gerekiyor muydu ve Gerekiyorsa kullanıcı doğrulamış mı ? */
            if (config.verification.phone && !_user.verification.phone_verifyed) {

                await netgsm.send({                                 // Kullanıcıya SMS gönderir
                    user: _user._id,                                // SMS gönderilen kullanıcı ID
                    created_by: _user._id,                          // SMS gönderen kullanıcı ID
                    gsmno: _user.phone,                             // SMS gönderilen kullanıcı telefon numarası
                    type: 'register',                               // SMS Mesaj içeriği türü
                    code: _user.verification.phone_code             // Gönderilen doğrulama kodu
                });

                /** Kullanıcı hesabı doğrulanmamış ise hata mesajı üretir */
                return res.error('not_verification_phone', null, { key: _user.verification.key });
            }

            /** Email doğrulama işlemi gerekiyor muydu ve Gerekiyorsa kullanıcı doğrulamış mı ? */
            if (config.verification.email && !_user.verification.email_verifyed) {

                await mail.send({                                   // Kullanıcıya mail gönderir
                    name: _user.name,                               // Kullanıcı adı
                    email: _user.email,                             // Kullanıcı eposta adresi
                    subject: 'Eposta Doğrulama',                    // Mail Başlığı
                    html: await verification_mail_template({            // Mail template
                        code: _user.verification.email_code,        // Doğrulama kodu
                        name: _user.name                            // Kullanıcının tam adı
                    })
                });

                /** Kullanıcı hesabı doğrulanmamış ise hata mesajı üretir */
                return res.error('not_verification_email', null, { key: _user.verification.key });
            }

        }
    }

    /** Kullanıcı kayıtlı şifresi ile göndermiş olduğu şifrenin eşleşmesi kontrol ediliyor */
    const match = await match_password(body.password, _user.password);
    if (!match) {

        /** Şifreler aynı değilse hata mesajı döner */
        return res.error("failed_login_information");
    }

    const bearer = await encode_token(_user._id, _user.type); // Bearer token üretiliyor

    /** Kullanıcı bilgilerinden password çıkartılıp response dönüyor. */
    return res.respond({
        user: _.omit(_user.toObject(), ['password', 'verification.phone_code', 'verification.email_code', 'verification.phone_expiration', 'verification.email_expiration']),
        bearer: bearer
    }, 'login');
}

module.exports = {
    scheme,
    route
}