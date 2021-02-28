const express = require('express')
const router = express.Router()

router.get('/', (req, res) => res.send('test - users'))

module.exports = router
