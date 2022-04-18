const mongoose = require('mongoose');
const { config, Debug } = require('../util/index');
const functions = require('./functions');
const user = require('./user');
const countries = require('./countries');
const cities = require('./cities');
const districts = require('./districts');
const sent_sms = require('./sent_sms');

mongoose.connect(config.mongoConnectionString, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => Debug('Veritabanı Bağlantısı Başarılı'))
    .catch(err => Debug("Veritabanı Bağlantı Hatası: ", err));

module.exports = {
    mongoose,
    functions,
    user,
    countries,
    cities,
    districts,
    sent_sms
}