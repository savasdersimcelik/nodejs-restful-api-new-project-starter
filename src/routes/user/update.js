const { joi, joi_error_message, config } = require('../../util');
const { user } = require('../../models');

const scheme = joi.object({
    first_name: joi.string().empty("").label('İsim').default("İsim"),
    last_name: joi.string().empty("").label('Soyisim').default("Soyisim"),
    email: joi.string().empty("").email().label('Eposta Adresi'),
    phone: joi.string().empty("").length(11).label('Telefon Numarası'),
    password: joi.string().min(6).max(25).required().label('Şifre')
}).options({ stripUnknown: true }).error(joi_error_message);

const route = async (req, res) => {
    let { body, params, query } = req;

    let _user = await user.findOne({ _id: req.client._id });
    if(!_user){
        return res.error(400, "Böyle bir kullanıcı bulunamadı");
    }

    _user.name = body.first_name + ' ' + body.last_name;
    _user.name = body.first_name + ' ' + body.last_name;
    _user.email = body.email;
    _user.phone = body.phone;

    _user.save(body);

    return res.respond({
        user: _user
    }, "update");
}


module.exports = {
    scheme,
    route
}