const express = require('express')
const router = express.Router()

router.get('/', (req, res) => res.send('admin page success!'))

module.exports = router
