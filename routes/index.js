<<<<<<< HEAD
const express = require('express')
const router = express.Router()
const tweets = require('./modules/tweets')
const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/api/tweets', tweets)
router.get('/', (req, res) => res.redirect('/tweets'))
router.use('/', apiErrorHandler)

module.exports = router
=======
// require needed modules
const express = require('express')
const router = express.Router()
const { apiErrorHandler } = require('../middleware/error-handler')

// require routes modules
const admin = require('./modules/admin')
const users = require('./modules/users')

// use router
router.use('/api/admin', admin)
router.use('/api/users', users)
router.use('/', apiErrorHandler)

module.exports = router
>>>>>>> 525e157e1eb46f1a8596ba611a8cca351ffcc3d4
