const { joi, joi_error_message, config } = require('../../util');
const { districts } = require('../../models');

const scheme = joi.object({
    city: joi.string().empty(null).label('Şehir ID'),
    country: joi.string().empty(null).label('Ülke ID'),
}).options({ stripUnknown: true }).error(joi_error_message);

const route = async (req, res) => {
    let { body, params, query } = req;

    let _districts = [];
    if(query?.country && query?.city){
        _districts = await districts.find({ country: query.country, city: query.city });
    }else if(query?.city){
        _districts = await districts.find({ city: query.city });
    }else if(query?.country){
        _districts = await districts.find({ country: query.country });
    }else{
        _districts = await districts.find();
    }

    return res.respond({
        districts: _districts
    });
}


module.exports = {
    scheme,
    route
}