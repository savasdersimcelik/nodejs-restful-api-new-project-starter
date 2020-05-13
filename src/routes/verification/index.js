const express = require('express');
const { validation } = require('../../middlewares');
const router = express.Router();
const forgot = require('./forgot');
const account = require('./account');

router.post('/forgot', validation(forgot.scheme), forgot.route);
router.post('/account', validation(account.scheme), account.route);

module.exports = router;