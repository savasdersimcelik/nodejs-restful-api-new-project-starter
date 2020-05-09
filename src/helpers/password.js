const bcrypt = require('bcrypt');
const { Debug, config } = require('../util');
const { getTimeAdd, toISOString } = require('./date');
const { user } = require('../models');

const hash_password = async (password) => {
    return await bcrypt.hash(password, 10);
}

const match_password = async (password0, password1) => {
    try {
        const match = await bcrypt.compare(password0, password1);
        return match;
    } catch (e) {
        Debug(e);
        return false;
    }
}

const create_initial_admin_account = async () => {
    let { initialAdminAccount } = config;
    const exist = await user.findOne({ type: "admin", email: initialAdminAccount.email });

    if (exist)
        return Debug("Email:" + initialAdminAccount.email);

    const account = new user({
        first_name: initialAdminAccount.first_name,
        last_name: initialAdminAccount.last_name,
        name: initialAdminAccount.first_name + " " + initialAdminAccount.last_name,
        email: initialAdminAccount.email,
        phone: initialAdminAccount.phone,
        password: await hash_password(initialAdminAccount.password),
        type: 'admin',
        isActive: true,
        isDelete: false,
        verification: {
            phone_verifyed: true,
            phone_code: await generate_random_code(6, true),
            phone_expiration: await getTimeAdd(900),
            phone_verifyed_date: await toISOString(),
            email_verifyed: true,
            email_code: await generate_random_code(6, true),
            email_expiration: await getTimeAdd(900),
            email_verifyed_date: await toISOString(),
        },
    });

    await account.save();
    Debug("İnitial Admin Account Created!");
    Debug("Email: " + initialAdminAccount.email + "\nPassword: " + initialAdminAccount.password);
}



function generate_random_code(length, numeric = false) {
    var result = '';
    var characters = numeric ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = {
    hash_password,
    match_password,
    create_initial_admin_account,
    generate_random_code,
}