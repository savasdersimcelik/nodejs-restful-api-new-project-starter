const express = require('express');
const { validation } = require('../../middlewares');
const router = express.Router();
const forgot = require('./forgot');

router.post('/forgot', validation(forgot.scheme), forgot.route);

module.exports = router;