const express = require('express');
const { validation } = require('../../middlewares');
const router = express.Router();
const register = require('./register');

router.post('/register', validation(register.scheme), register.route);

module.exports = router;