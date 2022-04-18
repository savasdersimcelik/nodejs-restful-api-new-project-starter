const { joi, joi_error_message, config } = require('../../util');
const { countries } = require('../../models');

const scheme = joi.object({
    title: joi.string().required().label('Ülke Adı'), 
}).options({ stripUnknown: true }).error(joi_error_message);

const route = async (req, res) => {
    let { body, params, query } = req;
    body.created_by = req.client._id;

    let _countries = new countries();
    _countries.set(body);
    _countries = await _countries.save();

    return res.respond({
        country: _countries
    }, "create");
}


module.exports = {
    scheme,
    route
}