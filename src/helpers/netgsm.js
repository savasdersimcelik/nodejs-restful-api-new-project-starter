const axios = require('axios');
const { sent_sms } = require('../models')
const { config } = require('../util');

/**
 * NetGSM Bakiye sorgulama
 */
exports.credit_balance = async () => {
    try {
        const response = await axios.get('https://api.netgsm.com.tr/balance/list/get', {
            params: {
                usercode: config.netgsm.usercode,
                password: config.netgsm.password
            }
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * NetGSM SMS bakiyesi sorgulama
 */
exports.sms_balance = async () => {
    try {
        const response = await axios.get('https://api.netgsm.com.tr/balance/list/get', {
            params: {
                usercode: config.netgsm.usercode,
                password: config.netgsm.password,
                tip: 1
            }
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * NetGSM Onaylanmış başlıklar listeler
 */
exports.header = async () => {
    try {
        const response = await axios.get('https://api.netgsm.com.tr/sms/header', {
            params: {
                usercode: config.netgsm.usercode,
                password: config.netgsm.password
            }
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * 
 */
exports.report = async (bulkid) => {
    try {
        const response = await axios.get('https://api.netgsm.com.tr/sms/report', {
            params: {
                usercode: config.netgsm.usercode,
                password: config.netgsm.password,
                bulkid: bulkid
            }
        });
        const data = response.data.split('<br>');
        const map1 = data.map((element) => {
            return {
                number: element.split(' ')[0],
                status: element.split(' ')[1]
            }
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * NetGSM Mesaj gönderme
 * @param {Object} param : Mesaj gönderilirken kullanılacak parametreler
 */
exports.send = async (param) => {
    try {
        const response = await axios.get('https://api.netgsm.com.tr/sms/send/get/', {
            params: {
                usercode: config.netgsm.usercode,
                password: config.netgsm.password,
                msgheader: config.netgsm.sender,
                gsmno: param.gsmno,
                message: await message_content(param)
            }
        });
        const split = response.data.split(' ');
        if (split[1]) {
            let _sent_sms = new sent_sms();
            _sent_sms.set({
                user: param.user,
                phone: param.gsmno,
                type: param.type,
                message: await message_content(param),
                created_by: param.created_by
            });
            _sent_sms = await _sent_sms.save();
            return split[1];
        }
        return false;

    } catch (error) {
        console.error(error);
    }
}

/**
 * 
 * @param {Object} param: Mesaj içeriği üretilirken kullanılacak parametreler
 */
const message_content = async (param) => {
    switch (param.type) {
        case 'register':
            return config.projectName + ' Kayıt olduğunuz için teşekkürler. Doğrulama kodunuz: ' + param.code;
            break;
        case 'resend':
            return config.projectName + ' Telefon numaranızı doğrulamak için kodunuz: ' + param.code;
            break;
        case 'forgot_password':
            return config.projectName + ' Şifre sıfırlamak için doğrulama kodunuz: ' + param.code;
            break;
        case 'verification':
            return config.projectName + ' Telefon numaranızı doğrulamak için kodunuz: ' + param.code;
            break;
        default:
            return param.message;
    }
}