const express = require('express')
const router = express.Router()

router.get('/', (req, res) => res.send('test - followships'))

module.exports = router
