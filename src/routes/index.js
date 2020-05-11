
const express = require('express');
const router = express.Router();
const api = express.Router();

const auth = require('./auth');
const forgot = require('./forgot');

api.use('/auth', auth);
api.use('/forgot', forgot);

router.use('/api', api);

module.exports = router;