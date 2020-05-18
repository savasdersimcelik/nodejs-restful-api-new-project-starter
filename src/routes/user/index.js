const express = require('express');
const { validation } = require('../../middlewares');
const router = express.Router();
const fcm = require('./fcm');

router.put('/fcm', validation(fcm.scheme), fcm.route);

module.exports = router;