const { joi, joi_error_message, config } = require('../../util');
const { cities } = require('../../models');

const scheme = joi.object({
    title: joi.string().required().label('Şehir Adı'), 
    country: joi.string().required().label('Ülke ID'),
}).options({ stripUnknown: true }).error(joi_error_message);

const route = async (req, res) => {
    let { body, params, query } = req;
    body.created_by = req.client._id;

    let _cities = new cities();
    _cities.set(body);
    _cities = await _cities.save();

    return res.respond({
        city: _cities
    }, "create");
}


module.exports = {
    scheme,
    route
}