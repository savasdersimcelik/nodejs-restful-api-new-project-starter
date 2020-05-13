const nodemailer = require('nodemailer');
const { config } = require('../util');

const transport = nodemailer.createTransport({
    host: config.nodemailer.host,
    secure: false,
    port: config.nodemailer.port,
    auth: {
        user: config.nodemailer.user,
        pass: config.nodemailer.password
    },
    tls: {
        rejectUnauthorized: config.nodemailer.rejectUnauthorized
    }
});

/**
 * nodemailer kütüphanesi ile mail gönderen metot
 * @param {Object} param : Mail gönderilirken kullanılacak parametreler
 */
exports.send = async (param) => {
    const info = await transport.sendMail({
        from: '"' + config.projectName + '" <' + config.nodemailer.user + '>',
        to: param.email,
        subject: config.projectName + ' ' + param.subject,
        html: param.html,
    });

    if (info.response.split(' ')[1] == 'OK') {
        return true;
    }
    return false;
}