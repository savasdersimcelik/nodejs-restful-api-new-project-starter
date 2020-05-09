
const express = require('express');
const router = express.Router();
const api = express.Router();

const auth = require('./auth');

api.use('/auth', auth);

router.use('/api', api);

module.exports = router;