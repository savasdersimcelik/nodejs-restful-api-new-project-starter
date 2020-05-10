const { user } = require('../../models');
const { joi, joi_error_message, config } = require('../../util');
const { match_password, encode_token } = require('../../helpers');
const _ = require('lodash');

/** 
 * Kullanıcı giriş yaparken uygulması gereken kurallar şeması
 */
const scheme = joi.object({
    email: joi.string().email().label('Email'),                                         // Kullanıcı eposta adresi
    phone: joi.string().label('Telefon'),                                               // Kullanıcı Telefon Numarası
    password: joi.string().min(6).max(20).required().label('Şifre'),                    // Kullanıcı Şifre
}).options({ stripUnknown: true }).xor('email', 'phone').error(joi_error_message);      // Joi Ayarlar

const route = async (req, res) => {
    let { body, params, query } = req;

    /** Kullanıcı eposta adresi veya telefon numarasına göre veritabanına göre sorgu */
    let _user = await user.findOne({ $or: [{ phone: body.phone }, { email: body.email }] }).select("+password");
    if (!_user) {
        return res.error(400, "Lütfen giriş bilgilerinizi kontrol edin."); // Kullanıcı yoksa hata mesaj döner
    }

    if (config.verification.phone) {
        /** Kullanıcı hesabı doğrulanmış mı kontrol eder. */
        if (!_user.verification.phone_verifyed) {
            return res.error(400, "Telefon numaranızı doğrulamanız gerekmektedir."); // Kullanıcı hesabı doğrulanmamış ise hata mesajı üretir
        }
    }

    if (config.verification.email) {
        /** Kullanıcı hesabı doğrulanmış mı kontrol eder. */
        if (!_user.verification.email_verifyed) {
            return res.error(400, "Eposta adresinizi doğrulamanız gerekmektedir."); // Kullanıcı hesabı doğrulanmamış ise hata mesajı üretir
        }
    }

    /** Kullanıcı kayıtlı şifresi ile göndermiş olduğu şifrenin eşleşmesi kontrol ediliyor */
    const match = await match_password(body.password, _user.password);
    if (!match) {
        return res.error(400, "Lütfen giriş bilgilerinizi kontrol edin."); // Şifreler aynı değilse hata mesajı döner
    }

    const bearer = await encode_token(_user._id, _user.type); // Bearer token üretiliyor
    return res.respond({ user: _.omit(_user.toObject(), "password"), bearer }); // Kullanıcı bilgilerinden password çıkartılıp response dönüyor.
}

module.exports = {
    scheme,
    route
}