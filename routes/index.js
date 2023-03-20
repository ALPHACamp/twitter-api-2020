const express = require('express');

const router = express.Router();
const { errorHandler } = require('../middleware/error-handler');
const tweet = require('./modules/tweet');

router.use('/tweets', tweet);
router.use('/', errorHandler);

module.exports = router;
