const { user } = require('../../models');
const { joi, joi_error_message, config } = require('../../util');
const { hash_password, generate_random_code, date, netgsm, mail } = require('../../helpers');
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

    /** Gönderilen kullanıcı bilgileri ile ilgili veritabanında sorgu yapar */
    let _user = await user.findOne({ $or: [{ phone: body.phone }, { email: body.email }] });
    if (!_user) {
        return res.error(400, "Böyle bir kullanıcı bulunamadı. Lütfen bilgilerinizi kontrol edin."); // Kullanıcı yoksa hata mesaj döner
    }

    _user.set({                                                 // Kullanıcı yeni datalarını set eder
        verification: {
            email_code: await generate_random_code(6, true),    // Eposta için doğrulama kodu üretir
            phone_code: await generate_random_code(6, true),    // Telefon için doğrulama kodu üretir
        },
        forgot_key: CryptoJS.AES.encrypt(_user._id.toString(), config.secretKey).toString() // Doğrulama ve şifre sıfırlama için hash üretir
    });
    _save = await _user.save();                                 // Yeni kodları sisteme ekler.

    if (_save) {                                                // Ekleme işlemi başarılı mı kontrol eder ?
        let code_send = false;
        if (config.forgot.phone) {
            code_send = await netgsm.send({                     // Kullanıcıya SMS gönderir
                user: _save._id,                                // SMS gönderilen kullanıcı ID
                created_by: _save._id,                          // SMS gönderen kullanıcı ID
                gsmno: _save.phone,                             // SMS gönderilen kullanıcı telefon numarası
                type: 'forgot_password',                        // SMS Mesaj içeriği türü
                code: _save.verification.phone_code             // Gönderilen doğrulama kodu
            })
        } else if (config.forgot.email) {
            code_send = await mail.send({                       // Kullanıcıya mail gönderir
                email: _save.email,                             // Kullanıcı eposta adresi
                subject: 'Şifre Sıfırlama',                     // Mail Başlığı
                html: await forgat_password_mail_template({     // Mail template
                    code: _save.verification.email_code,        // Doğrulama kodu
                    name: _save.name                            // Kullanıcının tam adı
                })
            })
        }
        if (code_send) {                                        // Email veya SMS gönderimi başarılı kontrol eder.
            return res.respond({ key: _save.forgot_key }, "Doğrulama kodu gönderildi.");   // Doğrulama kodu değiştirilirse başarılı response döner
        }
    }

    return res.error(500, "Bir hata meydana geldi. Lütfen tekrar deneyin"); // Kayıt işlemi gerçekleşmezse hata mesajı döner.
}

module.exports = {
    scheme,
    route
}