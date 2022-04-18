const { user } = require('../../models');
const { joi, joi_error_message, config } = require('../../util');
const { generate_random_code, date, netgsm, mail } = require('../../helpers');
const { forgat_password_mail_template } = require('../../templates');
const CryptoJS = require("crypto-js");

/** 
 * Kullanıcı şifre sıfırlama şeması
 */
const scheme = joi.object({
    email: joi.string().email().label('Email'),             // Kullanıcı eposta adresi
    phone: joi.string().label('Telefon'),                   // Kullanıcı Telefon Numarası
}).options({ stripUnknown: true }).xor('email', 'phone').error(joi_error_message);

const route = async (req, res) => {
    let { body, params, query } = req;

    var _user = null;
    if(body?.phone){
        /** Gönderilen kullanıcı bilgileri ile ilgili veritabanında sorgu yapar */
        _user = await user.findOne({ phone: body.phone });
    }

    if(!_user && body?.email){
        /** Gönderilen kullanıcı bilgileri ile ilgili veritabanında sorgu yapar */
        _user = await user.findOne({ email: body.email });
    }

    if (!_user) {
        /**  Kullanıcı yoksa hata mesaj döner */
        return res.error("not_found_user");
    }

    /** Dataları JSON formatına dönüştürür */
    const data_stringify = JSON.stringify({ _id: _user._id, type: "forgot", expiration: await date.getTimeAdd(config.forgot.expiration_time) });

    /** Özel Anahtar Oluşturuluyor */
    const verification_key = CryptoJS.AES.encrypt(data_stringify, config.secretKey);

    _user.set({                                                 // Kullanıcı yeni datalarını set eder
        verification: {
            key: verification_key.toString(),                   // Şifre sıfırlamak için üretilen hash
            forgot_code: await generate_random_code(6, true),    // Şifre sıfırlamak doğrulama kodu üretir
            forgot_expiration: await date.getTimeAdd(config.verification.expiration_time),   // Doğrulama kodu geçerlilik süresi
        }
    });
    _user = await _user.save();                                 // Yeni kodları sisteme ekler.

    if (_user) {                                                // Ekleme işlemi başarılı mı kontrol eder ?
        let code_send = false;
        if (config.forgot.phone) {
            code_send = await netgsm.send({                     // Kullanıcıya SMS gönderir
                user: _user._id,                                // SMS gönderilen kullanıcı ID
                created_by: _user._id,                          // SMS gönderen kullanıcı ID
                gsmno: _user.phone,                             // SMS gönderilen kullanıcı telefon numarası
                type: 'forgot_password',                        // SMS Mesaj içeriği türü
                code: _user.verification.forgot_code             // Gönderilen doğrulama kodu
            })
        } else if (config.forgot.email) {
            code_send = await mail.send({                       // Kullanıcıya mail gönderir
                name: _user.name,                               // Kullanıcı adı
                email: _user.email,                             // Kullanıcı eposta adresi
                subject: 'Şifre Sıfırlama',                     // Mail Başlığı
                html: await forgat_password_mail_template({     // Mail template
                    code: _user.verification.forgot_code,        // Doğrulama kodu
                    name: _user.name                            // Kullanıcının tam adı
                })
            });
        }

        /** Email veya SMS gönderimi başarılı kontrol eder. */
        if (code_send) {

            /** Doğrulama kodu değiştirilirse başarılı response döner */
            return res.respond({ key: _user.verification.key }, "verification_code_send");
        }
    }

    /** Kayıt işlemi gerçekleşmezse hata mesajı döner. */
    return res.error("unknown_error");
}

module.exports = {
    scheme,
    route
}