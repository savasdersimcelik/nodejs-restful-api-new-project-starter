const helpers = require('../../helpers');

/**
 * Herhangi bir router'da çağırılırsa header'da Authorization var mı kontrol eder
 * Eğer Authorization varsa Bearer tokenı alır ve çözümler
 * Eğer Authorization yoksa request işlemini gerçekleştirmez.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
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