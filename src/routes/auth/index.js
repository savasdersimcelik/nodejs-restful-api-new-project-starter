const express = require('express');
const { validation } = require('../../middlewares');
const router = express.Router();
const register = require('./register');
const login = require('./login');

router.post('/register', validation(register.scheme), register.route);
router.post('/login', validation(login.scheme), login.route);

module.exports = router;