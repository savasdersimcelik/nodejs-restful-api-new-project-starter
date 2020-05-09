const { joi, joi_error_message } = require('../../util');
const { user } = require('../../models');
const { hash_password, generate_random_code, date, netgsm } = require('../../helpers');

/** Yeni kayıt olacak kullanıcılar için post ile gönderilecek data şeması */
const scheme = joi.object({
    first_name: joi.string().required().label('İsim'),
    last_name: joi.string().required().label('Soyisim'),
    email: joi.string().email().required().label('Eposta Adresi'),
    phone: joi.string().length(11).required().label('Telefon Numarası'),
    password: joi.string().min(6).max(25).required().label('Şifre')
}).options({ stripUnknown: true }).error(joi_error_message);

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

    body.verification = {
        phone_code: await generate_random_code(6, true), // 6 Haneli bir şifre oluşturuluyor.
        phone_expiration: await date.getTimeAdd(900), // Doğrulama kodunun geçerlilik süresi oluşturuluyor.
        email_code: await generate_random_code(6, true), // 6 Haneli bir şifre oluşturuluyor.
        email_expiration: await date.getTimeAdd(900), // Doğrulama kodunun geçerlilik süresi oluşturuluyor.
    }

    const _user = new user(); // Kullanıcı şeması tanımlanıyor.
    _user.set(body); // Kullanıcı dataları set ediliyor.
    _save = await _user.save(); // Kullanıcı sisteme kayıt ediliyor.

    if (_save) {

        const sms_send = await netgsm.send({
            user: _save._id,
            created_by: _save._id,
            gsmno: _save.phone,
            type: 'register',
            code: _save.verification.phone_code
        });

        if (sms_send) {
            return res.respond({}, "Kayıt işlemi başarılı bir şekilde gerçekleşti."); // Kayıt işlemi kontrol ediliyor eğer başarılı ise response dönüyor.
        }
    }

    return res.error(500, "Bir hata meydana geldi. Lütfen tekrar deneyin"); // Kayıt işlemi gerçekleşmezse hata mesajı döner.
}


module.exports = {
    scheme,
    route
}