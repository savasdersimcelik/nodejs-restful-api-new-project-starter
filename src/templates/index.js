const fs = require('fs');
const { promisify } = require('util');
const { config } = require('../util');
const Path = require('path');

const read_document = promisify(fs.readFile);

const html_parser = (html, params) => {
    Object.keys(params).forEach((key) => {
        let search_for = "${" + key + "}";
        html = html.split(search_for).join(params[key]);
    });
    return html;
}

const forgat_password_mail_template = async (param) => {
    let html = await read_document(Path.resolve(config.nodemailer.templates_dir, 'forgat_password.html'), "utf-8");
    html = html_parser(html, {
        code: param.code,
        name: param.name,
        project: config.projectName,
        logo: config.base_url + config.nodemailer.logo
    });
    return html;
}

const register_mail_template = async (param) => {
    console.log(config.base_url + config.nodemailer.logo)
    let html = await read_document(Path.resolve(config.nodemailer.templates_dir, 'register.html'), "utf-8");
    html = html_parser(html, {
        code: param.code,
        name: param.name,
        project: config.projectName,
        logo: config.base_url + config.nodemailer.logo
    });
    return html;
}

const verification_mail_template = async (param) => {
    let html = await read_document(Path.resolve(config.nodemailer.templates_dir, 'verification.html'), "utf-8");
    html = html_parser(html, {
        code: param.code,
        name: param.name,
        project: config.projectName,
        logo: config.base_url + config.nodemailer.logo
    });
    return html;
}

module.exports = {
    forgat_password_mail_template,
    register_mail_template,
    verification_mail_template
};