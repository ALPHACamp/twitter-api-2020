const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatController')

const path = require('path')
const filePath = './index.html'
const resolvedPath = path.resolve(filePath)
const helpers = require('../_helpers')

router.use(helpers.authenticated)

router.get('/:roomId', chatController.getContent)

// router.get('/', (req, res) => {
//   console.log(helpers.getUser(req))
//   res.sendFile(resolvedPath)
// })

module.exports = router