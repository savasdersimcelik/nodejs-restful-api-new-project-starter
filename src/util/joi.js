const joi = require('@hapi/joi')
joi.objectId = require('joi-objectid')(joi);
const _ = require('lodash');

const generic_error = p => new Error(`Bilinmeyen bir hata olustu.`);

const joi_error_message = (e) => {
    const { 0: err } = e;
    if (!err) {
        return generic_error();
    }

    const { local, code } = err;
    if (!local) {
        return generic_error();
    }

    console.log({ local, code })
    console.log({ err })

    switch (code) {
        case 'any.required':
            return new Error(local.label + " gereklidir.");
            break;
        case 'string.empty':
            return new Error(local.label + " boş olamaz.");
            break;
        case 'string.length':
            return new Error(local.label + " uzunluğunu " + local.limit + " karakter olması gerekmektedir.");
            break;
        case 'object.xor':
            var peers = "";
            var lastItem = local.peersWithLabels.pop();
            local.peersWithLabels.forEach(element => {
                peers = element + " veya " + peers;
            });
            return new Error(peers + lastItem + " bir tanesini göndermeniz gerekmektedir.");
            break;
        default:
            return new Error("Lütfen " + local.label + " alanını kontrol ediniz.");
            break;
    }
};

module.exports = {
    joi,
    joi_error_message
};