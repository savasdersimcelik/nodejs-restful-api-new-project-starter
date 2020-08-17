const bcrypt = require('bcrypt');
const { Debug, config } = require('../util');
const { getTimeAdd, toISOString } = require('./date');
const { generate_random_code } = require('./string');
const { user } = require('../models');

/**
 * Gönderilen değeri bcrypt kütüphanesi ile şifreler
 * @param {String} password: Hashlenecek string değer 
 */
const hash_password = async (password) => {
    return await bcrypt.hash(password, 10);
}

/**
 * Hashlenmiş bir şifre ile String bir değeri eşleştirir
 * @param {String} password0: Kullanıcıdan gelen şifre
 * @param {Hash} password1: Veritabanında hashli olarak tutulan şifre
 */
const match_password = async (password0, password1) => {
    try {
        const match = await bcrypt.compare(password0, password1);
        return match;
    } catch (e) {
        Debug(e);
        return false;
    }
}

/**
 * Sistem ilk çalıştırıldığında Root bir yönetici oluşturur
 */
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
            forgot_verifyed: true,
            forgot_code: await generate_random_code(6, true),
            forgot_expiration: await getTimeAdd(900),
        },
    });

    await account.save();
    Debug("İnitial Admin Account Created!");
    Debug("Email: " + initialAdminAccount.email + "\nPassword: " + initialAdminAccount.password);
}

module.exports = {
    hash_password,
    match_password,
    create_initial_admin_account
}