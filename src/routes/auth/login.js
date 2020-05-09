const { user } = require('../../models');
const { joi, joi_error_message } = require('../../util');
const { match_password, encode_token } = require('../../helpers');
const _ = require('lodash');

const scheme = joi.object({
    email: joi.string().email().label('Email'),
    phone: joi.string().label('Telefon'),
    password: joi.string().min(6).max(20).required().label('Şifre'),
}).options({ stripUnknown: true }).xor('email', 'phone').error(joi_error_message);

const route = async (req, res) => {
    let { body, params, query } = req;

    let _user = await user.findOne({ $or: [{ phone: body.phone }, { email: body.email }] }).select("+password");
    if (!_user) {
        return res.error(422, "Lütfen giriş bilgilerinizi kontrol edin.");
    }

    const match = await match_password(body.password, _user.password);
    if (!match) {
        return res.error(401, "Lütfen giriş bilgilerinizi kontrol edin.");
    }

    const bearer = await encode_token(_user._id, _user.type);
    return res.respond({ user: _.omit(_user.toObject(), "password"), bearer });

}

module.exports = {
    scheme,
    route
}