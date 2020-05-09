const { model, Schema } = require("mongoose");

const sent_sms_schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    phone: { type: Schema.Types.String, required: true },
    message: { type: Schema.Types.String, required: true },
    type: { type: Schema.Types.String, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    created_at: { type: Schema.Types.Date, default: Date.now },
    updated_at: { type: Schema.Types.Date },
});

var updateAt = function (next) {
    this.updated_at = Date.now()
    next();
};

sent_sms_schema.pre('findOneAndUpdate', updateAt).pre('updateOne', updateAt).pre('save', updateAt)

const sent_sms = model('sent_sms', sent_sms_schema);

module.exports = sent_sms;