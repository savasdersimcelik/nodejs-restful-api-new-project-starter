const { joi, joi_error_message, config } = require('../../util');
const { user } = require('../../models');
const { hash_password, generate_random_code, date, netgsm, mail } = require('../../helpers');
const { register_mail_template } = require('../../templates');
const CryptoJS = require("crypto-js");

/**
 * Yeni kayıt olacak kullanıcılar için post ile gönderilecek data şeması
 */
const scheme = joi.object({
    first_name: joi.string().empty("").label('İsim').default("İsim"),                           // Kullanıcı adı
    last_name: joi.string().empty("").label('Soyisim').default("Soyisim"),                      // Kullanıcı soyadı
    email: joi.string().empty("").email().label('Eposta Adresi'),                               // Kullanıcı eposta adresi
    phone: joi.string().empty("").length(11).label('Telefon Numarası'),                         // Kullanıcı telefon numarası
    password: joi.string().min(6).max(25).required().label('Şifre'),                            // Kullanıcı Şifresi
    type: joi.string().empty("").label('Üyelik Türü').default("user"),                          // Kullanıcı Üyelik Türü
    location: joi.object().empty("").label('Konum Bilgileri'),                                  // Konum Bilgileri
}).options({ stripUnknown: true }).error(joi_error_message);                                    // Joi Ayarlar

const route = async (req, res) => {
    let { body, params, query } = req;
    if (config.required.phone) {
        if (!body?.phone) {
            return res.error("require_phone");
        }

        /** Gelen telefon numarası veritabanında kontrol ediliyor. */
        const phone_control = await user.findOne({ phone: body.phone, is_delete: false });
        if (phone_control) {
            return res.error("phone_used");
        }
    }

    if (config.required.email) {
        if (!body?.email) {
            return res.error("require_email");
        }

        /** Gelen eposta adresi veritabanında kontrol ediliyor. */
        const email_control = await user.findOne({ email: body.email, is_delete: false });
        if (email_control) {
            return res.error("phone_email");
        }
    }

    body.password = await hash_password(body.password);                                         // Kullanıcı şifresi hashleniyor.
    body.name = body.first_name + ' ' + body.last_name;                                         // Kullanıcı adı ve soyadı birleştiriliyor.
    body.is_active = config.verification.phone || config.verification.email ? false : true;     // Herhangi bir doğrulama sistemi aktif ise hesap aktif false olur
    body.verification = {
        phone_verifyed: config.verification.phone ? false : true,                           // Eğer doğrulama sistemini kontrol eder.
        email_verifyed_date: config.verification.phone ? null : await date.toISOString(),   // Doğrulama sistemi false ise tarih oluşturur
        phone_code: await generate_random_code(6, true),                                    // 6 Haneli bir şifre oluşturuluyor.
        phone_expiration: await date.getTimeAdd(config.verification.expiration_time),       // Doğrulama kodunun geçerlilik süresi oluşturuluyor.
        email_verifyed: config.verification.email ? false : true,                           // Eğer doğrulama sistemini kontrol eder.
        email_verifyed_date: config.verification.email ? null : await date.toISOString(),   // Doğrulama sistemi false ise tarih oluşturur
        email_code: await generate_random_code(6, true),                                    // 6 Haneli bir şifre oluşturuluyor.
        email_expiration: await date.getTimeAdd(config.verification.expiration_time),       // Doğrulama kodunun geçerlilik süresi oluşturuluyor.
    }

    let _user = new user();                                   // Kullanıcı şeması tanımlanıyor.
    _user.set(body);                                            // Kullanıcı dataları set ediliyor.
    _user = await _user.save();                                 // Kullanıcı sisteme kayıt ediliyor.

    if (_user) {

        if (config.verification.phone) {
            await netgsm.send({                                 // Kullanıcıya SMS gönderir
                user: _user._id,                                // SMS gönderilen kullanıcı ID
                created_by: _user._id,                          // SMS gönderen kullanıcı ID
                gsmno: _user.phone,                             // SMS gönderilen kullanıcı telefon numarası
                type: 'register',                               // SMS Mesaj içeriği türü
                code: _user.verification.phone_code             // Gönderilen doğrulama kodu
            });
        }

        if (!config.verification.phone && config.verification.email) {
            await mail.send({                                   // Kullanıcıya mail gönderir
                name: _user.name,                               // Kullanıcı adı
                email: _user.email,                             // Kullanıcı eposta adresi
                subject: 'Eposta Doğrulama',                    // Mail Başlığı
                html: await register_mail_template({            // Mail template
                    code: _user.verification.email_code,        // Doğrulama kodu
                    name: _user.name                            // Kullanıcının tam adı
                })
            });
        }

        /** Doğrulama işlemi yapılması gerekiyor mu ? Kontrol eder */
        if (config.verification.email || config.verification.phone) {

            /** Doğrulama işlemi nasıl gerçekleşecek */
            const verif_type = config.verification.phone ? 'phone' : 'email';

            /** Doğrulama işlemi için özel anahtar oluşturur */
            const data_stringify = JSON.stringify({ _id: _user._id, type: verif_type, expiration: await date.getTimeAdd(config.verification.expiration_time) });

            /** Özel anahtarı oluşturuluyor. */
            const verification_key = CryptoJS.AES.encrypt(data_stringify, config.secretKey);

            _user.set({                                         // Kullanıcı yeni datalarını set eder
                verification: {
                    key: verification_key.toString(),           // Doğrulama kodu için üretilen hash
                }
            });
            _save = await _user.save();                         // Yeni datalar sisteme ekleniyor.

            if (_save) {
                /** Kayıt işlemi kontrol ediliyor eğer başarılı ise response dönüyor. */
                return res.respond({ key: _save.verification.key }, "register_verification");
            }

        }

        /** Kayıt işlemi kontrol ediliyor eğer başarılı ise response dönüyor. */
        return res.respond({}, "register");
    }

    /** Kayıt işlemi gerçekleşmezse hata mesajı döner. */
    return res.error("unknown_error");
}


module.exports = {
    scheme,
    route
}