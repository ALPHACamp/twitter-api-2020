const express = require('express')
const router = express.Router()
// const userController = require('../../controllers/user-controller')

router.get('/', (req, res) => res.send(console.log(req.originalUrl)))

module.exports = router
