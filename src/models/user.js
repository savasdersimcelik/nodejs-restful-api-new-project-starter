const { model, Schema } = require("mongoose");
const { config } = require('../util');

const user_schema = new Schema({
    name: { type: Schema.Types.String, required: false, default: null },
    first_name: { type: Schema.Types.String, required: false, default: null },
    last_name: { type: Schema.Types.String, required: false, default: null },
    email: { type: Schema.Types.String, required: config.required.email, default: null, unique: config.required.email },
    phone: { type: Schema.Types.String, required: config.required.phone, default: null, unique: config.required.phone },
    password: { type: Schema.Types.String, required: true, select: false },
    verification: {
        key: { type: Schema.Types.String, default: "", select: false },
        phone_code: { type: Schema.Types.String, default: "000000", select: false },
        phone_expiration: { type: Schema.Types.Number, default: "00000", select: false },
        phone_verifyed: { type: Schema.Types.Boolean, default: false },
        phone_verifyed_date: { type: Schema.Types.Date, default: null, select: false },
        email_code: { type: Schema.Types.String, default: "000000", select: false },
        email_expiration: { type: Schema.Types.Number, default: "000000", select: false },
        email_verifyed: { type: Schema.Types.Boolean, default: false },
        email_verifyed_date: { type: Schema.Types.Date, default: null, select: false },
        forgot_code: { type: Schema.Types.String, default: "000000", select: false },
        forgot_expiration: { type: Schema.Types.Number, default: "00000", select: false },
        forgot_verifyed_date: { type: Schema.Types.Date, default: null, select: false },
    },
    contracts: {
        terms_accepted: { type: Schema.Types.Date, default: Date.now },
        privacy_accepted: { type: Schema.Types.Date, default: Date.now },
        cookies_accepted: { type: Schema.Types.Date, default: Date.now }
    },
    type: { type: Schema.Types.String, enum: ["admin", "partner", "user"], default: "user" },
    fcm_token: { type: Schema.Types.String, default: "", select: false },
    is_active: { type: Schema.Types.Boolean, default: false },
    is_delete: { type: Schema.Types.Boolean, default: false },
    created_at: { type: Schema.Types.Date, default: Date.now },
    updated_at: { type: Schema.Types.Date },
});

var updateAt = function (next) {
    this.updated_at = Date.now()
    next();
};

user_schema.pre('findOneAndUpdate', updateAt).pre('updateOne', updateAt).pre('save', updateAt)

const user = model('user', user_schema);

module.exports = user;