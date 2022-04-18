const { joi, joi_error_message, config } = require('../../util');
const { countries } = require('../../models');

const scheme = joi.object({
    
}).options({ stripUnknown: true }).error(joi_error_message);

const route = async (req, res) => {
    let { body, params, query } = req;

    let _countries = await countries.find();

    return res.respond({
        countries: _countries
    });
}


module.exports = {
    scheme,
    route
}