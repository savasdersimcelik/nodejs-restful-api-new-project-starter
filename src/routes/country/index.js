const express = require('express');
const { validation, requires_admin } = require('../../middlewares');
const router = express.Router();

const create = require('./create');
const info = require('./info');
const list = require('./list');

router.post('/create', requires_admin, validation(create.scheme), create.route);
router.get('/info', requires_admin, validation(info.scheme), info.route);
router.get('/list', requires_admin, validation(list.scheme), list.route);

module.exports = router;