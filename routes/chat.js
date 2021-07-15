const express = require('express')
const app = express()
const router = express.Router()
const chatController = require('../controllers/chatController')

const path = require('path')
const filePath = './index.html'
const resolvedPath = path.resolve(filePath)
const helpers = require('../_helpers')


router.get('/', (req, res) => {
  res.sendFile(resolvedPath)
})

// router.get('/', (req, res) => {
//   let messages = 'hellow world'
//   res.send(messages);
// })


// router.use(helpers.authenticated)


router.get('/:roomId', chatController.getContent)



router.post('/:roomId', chatController.postMessage)


module.exports = router