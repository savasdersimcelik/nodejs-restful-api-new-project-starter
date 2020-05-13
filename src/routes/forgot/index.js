const express = require('express');
const { validation } = require('../../middlewares');
const router = express.Router();
const password = require('./password');
const change = require('./change');

router.post('/password', validation(password.scheme), password.route);
router.post('/password/change', validation(change.scheme), change.route);

module.exports = router;