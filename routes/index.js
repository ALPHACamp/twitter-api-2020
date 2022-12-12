const express = require('express')
const router = express.Router()

const apis = require('./modules/apis')

router.use('/api', apis)
app.get('/', (req, res) => res.send('Hello World!'))

module.exports = router
