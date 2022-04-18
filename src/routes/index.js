
const express = require('express');
const router = express.Router();
const api = express.Router();

const auth = require('./auth');
const forgot = require('./forgot');
const send = require('./send');
const verification = require('./verification');
const user = require('./user');
const country = require('./country');
const city = require('./city');
const district = require('./district');

api.use('/auth', auth);
api.use('/forgot', forgot);
api.use('/send', send);
api.use('/verification', verification);
api.use('/user', user);
api.use('/country', country);
api.use('/city', city);
api.use('/district', district);

router.use('/api', api);

module.exports = router;