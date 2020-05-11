const express = require('express');
const { validation } = require('../../middlewares');
const router = express.Router();
const password = require('./password');

router.post('/password', validation(password.scheme), password.route);

module.exports = router;