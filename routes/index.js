const express = require('express');

const router = express.Router();
const passport = require('passport');

const admin = require('./modules/admin');
const { apiErrorHandler } = require('../middleware/error-handle');

router.use('/admin', admin);

router.use('/', apiErrorHandler);

module.exports = router;
