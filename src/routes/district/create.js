const { joi, joi_error_message, config } = require('../../util');
const { districts, cities } = require('../../models');

const scheme = joi.object({
    title: joi.string().required().label('İlçe Adı'), 
    city: joi.string().required().label('Şehir ID'),
}).options({ stripUnknown: true }).error(joi_error_message);

const route = async (req, res) => {
    let { body, params, query } = req;
    body.created_by = req.client._id;

    let _city = await cities.findOne({ _id: body.city });
    body.country = _city.country;

    let _districts = new districts();
    _districts.set(body);
    _districts = await _districts.save();

    return res.respond({
        district: _districts
    }, "create");
}


module.exports = {
    scheme,
    route
}