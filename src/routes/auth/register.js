const { joi, joi_error_message, config } = require('../../util');
const { user } = require('../../models');
const { hash_password, generate_random_code, date, netgsm, mail } = require('../../helpers');
const { register_mail_template } = require('../../templates');

/**
 * Yeni kayıt olacak kullanıcılar için post ile gönderilecek data şeması
 */
const scheme = joi.object({
    first_name: joi.string().required().label('İsim'),                      // Kullanıcı adı
    last_name: joi.string().required().label('Soyisim'),                    // Kullanıcı soyadı
    email: joi.string().email().required().label('Eposta Adresi'),          // Kullanıcı eposta adresi
    phone: joi.string().length(11).required().label('Telefon Numarası'),    // Kullanıcı telefon numarası
    password: joi.string().min(6).max(25).required().label('Şifre')         // Kullanıcı Şifresi
}).options({ stripUnknown: true }).error(joi_error_message);                // Joi Ayarlar

const route = async (req, res) => {
    let { body, params, query } = req;

    /** Gelen telefon numarası veritabanında kontrol ediliyor. */
    const phone_control = await user.findOne({ phone: body.phone, is_delete: false });
    if (phone_control) {
        return res.error(400, "Bu telefon numarası ile kayıtlı bir kullanıcı bulunmakta.");
    }

    /** Gelen eposta adresi veritabanında kontrol ediliyor. */
    const email_control = await user.findOne({ email: body.email, is_delete: false });
    if (email_control) {
        return res.error(400, "Bu eposta adresi ile kayıtlı bir kullanıcı bulunmakta.");
    }

    body.password = await hash_password(body.password); // Kullanıcı şifresi hashleniyor.
    body.name = body.first_name + ' ' + body.last_name; // Kullanıcı adı ve soyadı birleştiriliyor.
    body.is_active = config.verification.phone || config.verification.email ? false : true, // Herhangi bir doğrulama sistemi aktif ise hesap aktif false olur

        body.verification = {
            phone_verifyed: config.verification.phone ? false : true, // Eğer doğrulama sistemini kontrol eder.
            email_verifyed_date: config.verification.phone ? null : await date.toISOString(), // Doğrulama sistemi false ise tarih oluşturur
            phone_code: await generate_random_code(6, true), // 6 Haneli bir şifre oluşturuluyor.
            phone_expiration: await date.getTimeAdd(config.verification.expiration_time), // Doğrulama kodunun geçerlilik süresi oluşturuluyor.
            email_verifyed: config.verification.email ? false : true, // Eğer doğrulama sistemini kontrol eder.
            email_verifyed_date: config.verification.email ? null : await date.toISOString(), // Doğrulama sistemi false ise tarih oluşturur
            email_code: await generate_random_code(6, true), // 6 Haneli bir şifre oluşturuluyor.
            email_expiration: await date.getTimeAdd(config.verification.expiration_time), // Doğrulama kodunun geçerlilik süresi oluşturuluyor.
        }

    const _user = new user();   // Kullanıcı şeması tanımlanıyor.
    _user.set(body);            // Kullanıcı dataları set ediliyor.
    _save = await _user.save(); // Kullanıcı sisteme kayıt ediliyor.

    if (_save) {

        if (config.verification.phone) {
            await netgsm.send({                     // Kullanıcıya SMS gönderir
                user: _save._id,                    // SMS gönderilen kullanıcı ID
                created_by: _save._id,              // SMS gönderen kullanıcı ID
                gsmno: _save.phone,                 // SMS gönderilen kullanıcı telefon numarası
                type: 'register',                   // SMS Mesaj içeriği türü
                code: _save.verification.phone_code // Gönderilen doğrulama kodu
            });
        }

        if (config.verification.email) {
            await mail.send({                                   // Kullanıcıya mail gönderir
                email: _save.email,                             // Kullanıcı eposta adresi
                subject: 'Eposta Doğrulama',                    // Mail Başlığı
                html: await register_mail_template({            // Mail template
                    code: _save.verification.email_code,        // Doğrulama kodu
                    name: _save.name                            // Kullanıcının tam adı
                })
            });
        }

        return res.respond({}, "Kayıt işlemi başarılı bir şekilde gerçekleşti."); // Kayıt işlemi kontrol ediliyor eğer başarılı ise response dönüyor.
    }

    return res.error(500, "Bir hata meydana geldi. Lütfen tekrar deneyin"); // Kayıt işlemi gerçekleşmezse hata mesajı döner.
}


module.exports = {
    scheme,
    route
}