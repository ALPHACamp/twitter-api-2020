const express = require('express')
const router = express.Router()

router.get('/', (req, res) => res.send('test - admin'))

module.exports = router
