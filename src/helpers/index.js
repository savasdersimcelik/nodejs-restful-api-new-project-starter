const { hash_password, match_password, create_initial_admin_account } = require('./password');
const { encode_token, decode_token } = require('./token');
const date = require('./date');
const netgsm = require('./netgsm');
const mail = require('./mail');
const { string_to_slug, tr_upperCase, generate_random_code } = require('./string');

module.exports = {
    hash_password,
    match_password,
    create_initial_admin_account,
    generate_random_code,
    encode_token,
    decode_token,
    date,
    netgsm,
    mail,
    string_to_slug,
    tr_upperCase
}