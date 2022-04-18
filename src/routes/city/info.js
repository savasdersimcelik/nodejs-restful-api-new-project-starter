const { joi, joi_error_message, config } = require('../../util');
const { cities } = require('../../models');

const scheme = joi.object({
    _id: joi.string().label('Şehir ID'),
}).options({ stripUnknown: true }).error(joi_error_message);

const route = async (req, res) => {
    let { body, params, query } = req;

    let _city = await cities.findOne({ _id: query._id });
    if(!_city){
        return res.error("not_found");
    }

    return res.respond({
        city: _city
    });
}


module.exports = {
    scheme,
    route
}