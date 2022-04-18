const { joi, joi_error_message, config } = require('../../util');
const { countries } = require('../../models');

const scheme = joi.object({
    _id: joi.string().label('Ülke ID'),
}).options({ stripUnknown: true }).error(joi_error_message);

const route = async (req, res) => {
    let { body, params, query } = req;

    let _country = await countries.findOne({ _id: query._id });
    if(!_country){
        return res.error("not_found");
    }

    return res.respond({
        country: _country
    });
}


module.exports = {
    scheme,
    route
}