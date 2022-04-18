const { config } = require('../../util');

const validation = (scheme) => {
    return (req, res, next) => {

        let params = req.method == "GET" ? req.query : req.body;
        const isValid = scheme.validate(params);
        if (isValid.error && isValid.error.details)
            return res.error(422, isValid.error.details[0]);

        if (isValid.error)
            return res.error(422, isValid.error.message);

        if (req.method == "POST"){
            req.body = isValid.value;
            req.lang = req.body?.lang ?? config.defaultLang
        }

        if (req.method == "GET"){
            req.query = isValid.value;
            req.lang = req.query?.lang ?? config.defaultLang
        }

        next();
    }
}


module.exports = validation;