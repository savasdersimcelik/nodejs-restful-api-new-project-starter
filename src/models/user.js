const { model, Schema } = require("mongoose");

const user_schema = new Schema({
    name: { type: Schema.Types.String, required: true },
    first_name: { type: Schema.Types.String, required: true },
    last_name: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true, unique: true },
    phone: { type: Schema.Types.String, required: true, unique: true },
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
    type: { type: Schema.Types.String, enum: ["admin", "user"], default: "user" },
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