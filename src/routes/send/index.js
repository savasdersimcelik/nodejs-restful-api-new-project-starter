const express = require('express');
const { validation } = require('../../middlewares');
const router = express.Router();
const code = require('./code');

router.post('/code', validation(code.scheme), code.route);

module.exports = router;