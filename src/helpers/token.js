const jwt = require('jsonwebtoken');
const { config } = require('../util');

/**
 * Bearer token oluşturur
 * @param {ObjectId} _id: Bearer token oluşturulacak kullanıcı ID değeri 
 * @param {String} type: Kullanıcı türü
 */
const encode_token = (_id, type) => {
    if (config.jwt_expiration > 0) {
        return jwt.sign({ _id: _id, type: type }, config.secretKey, { expiresIn: config.jwt_expiration });
    }

    return jwt.sign({ _id: _id, type: type }, config.secretKey);
}

/**
 * Bearer token çözümler
 * @param {String} token: Bearer token 
 */
const decode_token = (token) => {
    try {
        const decode = jwt.decode(token, config.secretKey);
        if (decode._id == null)
            return false;
        return decode;
    } catch (e) {
        return false;
    }
}

module.exports = {
    encode_token,
    decode_token
}