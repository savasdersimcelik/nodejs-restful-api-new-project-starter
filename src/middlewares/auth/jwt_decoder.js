const helpers = require('../../helpers');


const jwt_decoder = async (req, res, next) => {
    let auth = req.header('Authorization');
    if (!auth)
        return next();
    auth = auth.split('Bearer ');
    if (auth.length != 2)
        return next();
    auth = auth[1];
    const decode = helpers.decode_token(auth);
    if (!decode)
        return next();
    req.auth = decode;
    next();
}


module.exports = jwt_decoder;