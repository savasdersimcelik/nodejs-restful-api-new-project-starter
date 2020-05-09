const mongoose = require('mongoose');
const { config, Debug } = require('../util/index');
const functions = require('./functions');
const user = require('./user');

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
}