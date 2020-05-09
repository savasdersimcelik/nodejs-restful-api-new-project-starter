const jwt = require('jsonwebtoken');
const { config } = require('../util');

const encode_token = (_id, type) => {
    return jwt.sign({ _id: _id, type: type }, config.secretKey);
}

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