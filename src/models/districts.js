const { model, Schema } = require("mongoose");
const { config } = require('../util');

const districts_schema = new Schema({
    title: { type: Schema.Types.String, required: true },
    country: { type: Schema.Types.ObjectId, ref: 'countries', required: true },
    city: { type: Schema.Types.ObjectId, ref: 'cities', required: true },
    is_active: { type: Schema.Types.Boolean, default: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    created_at: { type: Schema.Types.Date, default: Date.now },
    updated_at: { type: Schema.Types.Date },
});

var updateAt = function (next) {
    this.updated_at = Date.now()
    next();
};

districts_schema.pre('findOneAndUpdate', updateAt).pre('updateOne', updateAt).pre('save', updateAt)

const districts = model('districts', districts_schema);

module.exports = districts;