const { joi, joi_error_message, config } = require('../../util');
const { districts } = require('../../models');

const scheme = joi.object({
    _id: joi.string().label('İlçe ID'),
}).options({ stripUnknown: true }).error(joi_error_message);

const route = async (req, res) => {
    let { body, params, query } = req;

    let _district = await districts.findOne({ _id: query._id });
    if(!_district){
        return res.error("not_found");
    }

    return res.respond({
        district: _district
    });
}


module.exports = {
    scheme,
    route
}