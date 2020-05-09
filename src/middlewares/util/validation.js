const validation = (scheme) => {
    return (req, res, next) => {

        let params = req.method == "POST" ? req.body : req.query;
        const isValid = scheme.validate(params);
        if (isValid.error && isValid.error.details)
            return res.error(422, isValid.error.details[0]);

        if (isValid.error)
            return res.error(422, isValid.error.message);

        if (req.method == "POST")
            req.body = isValid.value;

        if (req.method == "GET")
            req.query = isValid.value;

        next();
    }
}


module.exports = validation;