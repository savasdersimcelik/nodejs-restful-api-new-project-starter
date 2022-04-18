const { joi, joi_error_message, config } = require('../../util');
const { cities } = require('../../models');

const scheme = joi.object({
    country: joi.string().empty(null).label('Ülke ID'),
}).options({ stripUnknown: true }).error(joi_error_message);

const route = async (req, res) => {
    let { body, params, query } = req;

    let _cities = [];
    if (query?.country) {
        _cities = await cities.find({ country: query.country });
    } else {
        _cities = await cities.find();
    }

    return res.respond({
        cities: _cities
    });
}


module.exports = {
    scheme,
    route
}