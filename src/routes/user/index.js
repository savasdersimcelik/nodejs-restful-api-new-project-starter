const express = require('express');
const { validation, requires_user } = require('../../middlewares');
const router = express.Router();
const fcm = require('./fcm');
const update = require('./update');
const info = require('./info');

router.put('/fcm', requires_user, validation(fcm.scheme), fcm.route);
router.put('/update', requires_user, validation(update.scheme), update.route);
router.get('/info', requires_user, validation(info.scheme), info.route);

module.exports = router;