const { user } = require('../../models');
const { joi, joi_error_message, config } = require('../../util');
const { hash_password, match_password, date } = require('../../helpers');
const CryptoJS = require('crypto-js');

/** Şifre değiştirmek için kullanılacak şema */
const scheme = joi.object({
    key: joi.string().required().label('KEY'),                          // Şifre sıfırlama için KEY
    password: joi.string().required().label('Şifre'),                   // Yeni şifre
    password_again: joi.string().required().label('Şifre Tekrar')       // Yeni şifre tekrarı
}).options({ stripUnknown: true }).error(joi_error_message);

const route = async (req, res) => {
    let { body, params, query } = req;
    const unix_time = await date.unixTime();

    const bytes = CryptoJS.AES.decrypt(body.key, config.secretKey);         // Kullanıcıdan gelen KEY çözümlüyor.
    const decrypt_key = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));      // Çöüzmlenen değer UTF-8 olarak string hale getiriliyor

    /**  KEY içerisindeki datalar kontrol ediliyor. */
    if (!decrypt_key._id && !decrypt_key.expiration) {

        /** Geçersiz veya Manipüle edilmiş bir KEY gönderilmiş ise hata mesajı döner  */
        return res.error(400, "Bilinmeyen bir hata meydana geldi. Lütfen tekrar deneyin")
    }

    /**  Şifre sıfırlama işlemi için süre kontrol ediyor */
    if (decrypt_key.expiration < unix_time) {

        /** Eğer süre ( 5 DK ) dolmuş ise hata mesajı üretir  */
        return res.error(400, "Şifre sıfırlama süreniz dolmuş. Lütfen tekrar deneyin.")
    }

    /** Gönderilen KEY ile ilgili veritabanında ki kullanıcı sorgular */
    const _user = await user.findOne({ _id: decrypt_key._id, 'verification.key': body.key }).select('+password');
    if (!_user) {

        /** Eğer veritabanında kullanıcı yoksa hata mesajı dönerir. */
        return res.error(400, "Bilinmeyen bir hata meydana geldi. Lütfen tekrar deneyin");
    }

    /**  Şifreler eşleşiyor mu kontrol ediyor. */
    if (body.password != body.password_again) {

        /** Eğer şifreler eşlemiyorsa hata mesajı döner. */
        res.error(400, "Şifreler eşleşmiyor lütfen şifrelerinizi kontrol edin.")
    }

    /** Yeni şifre eski şifre ile aynı olabilir mi ? */
    if (!config.forgot.old_password) {

        /** Şifreler karşılaştırılıyor */
        const match = await match_password(body.password, _user.password);
        if (match) {

            /** Eğer yeni şifre eski şifre ile aynı ise hata mesajı döner */
            return res.error(400, "Yeni şifreniz eski şifreniz ile aynı olamaz.")
        }
    }

    /** Şifre değişikliği için hash oluşturuyor ve  Datalar JSON formatına dönüştürülüyor. */
    const data_stringify = JSON.stringify({ _id: _user._id });

    /** Özel Anahtar oluşturuluyor */
    const verification_key = CryptoJS.AES.encrypt(data_stringify, config.secretKey);
    const new_password = await hash_password(body.password);                    // Kullanıcı şifresi hashleniyor.

    _user.set({                                                                 // Kullanıcı dataları set ediliyor.
        verification: {
            key: verification_key.toString(),                                   // Yeni forgot_hash değeri
        },
        password: new_password                                                  // Yeni şifre HASH'lenmiş hali
    });
    _save = await _user.save();                                                 // Kullanıcı sisteme kayıt ediliyor.

    if (_save) {

        /** Kayıt işlemi kontrol ediliyor eğer başarılı ise response dönüyor. */
        return res.respond({}, "Şifreniz başarılı bir şekilde değiştirildi. Artık giriş yapabilirsiniz.");
    }

    /** Kayıt işlemi gerçekleşmezse hata mesajı döner. */
    return res.error(500, "Bir hata meydana geldi. Lütfen tekrar deneyin");
}

module.exports = {
    scheme,
    route
}