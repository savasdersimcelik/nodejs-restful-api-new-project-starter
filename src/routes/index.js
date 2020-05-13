
const express = require('express');
const router = express.Router();
const api = express.Router();

const auth = require('./auth');
const forgot = require('./forgot');
const verification = require('./verification');

api.use('/auth', auth);
api.use('/forgot', forgot);
api.use('/verification', verification);

router.use('/api', api);

module.exports = router;