const { config, joi, joi_error_message } = require('../../util');
const { user } = require('../../models');

/** FCM güncellemek için geçerli olan validasyon şeması */
const scheme = joi.object({
    fcm_token: joi.string().required()        // Kullanıcı eposta adresi
}).options({ stripUnknown: true }).error(joi_error_message);

const route = async (req, res) => {
    let { body, params, query, client } = req;

    /** Veritabanında böyle bir kullanıcı var mı kontrol eder ? */
    let _user = await user.findOne({ _id: client._id, is_delete: false });

    /** Kullanıcı var mı kontrol eder. */
    if (!_user) {

        /** Eğer kullanıcı yoksa hata mesajı döner. */
        return res.error(400, "Böyle bir kullanıcı mevcut değil. Lütfen bilgilerinizi kontrol edin.");
    }

    _user.set(body);                        // Kullanıcı bilgilerini set eder.
    _user = await _user.save();             // Kullanıcıyı bilgilerini günceller.

    /** Güncelleme sonrası Başarılı mesajı dönderir. */
    return res.respond({ user: _user }, "FCM Token başarılı bir şekilde güncellendi.");
}

module.exports = {
    scheme,
    route
}