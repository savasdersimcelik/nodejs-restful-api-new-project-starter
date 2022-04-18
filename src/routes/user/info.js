const { joi, joi_error_message, config } = require('../../util');
const _ = require('lodash');
const { user } = require('../../models');

const scheme = joi.object({
    
}).options({ stripUnknown: true }).error(joi_error_message);

const route = async (req, res) => {
    let { body, params, query } = req;

    let _user = await user.findOne({ _id: req.client._id });
    if(!_user){
        return res.error("not_found_user");
    }

    return res.respond({
        user: _.omit(_user.toObject(), ['password', 'verification.phone_code', 'verification.email_code', 'verification.phone_expiration', 'verification.email_expiration'])
    });
}



module.exports = {
    scheme,
    route
}