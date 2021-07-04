const express = require('express')
const router = express.Router()
const apis = require('./apis.js')
const chat = require('./chat.js')

router.use('/api', apis)
router.use('/chat', chat)

router.get('/', (req, res) => res.redirect('/chat'))

module.exports = router

