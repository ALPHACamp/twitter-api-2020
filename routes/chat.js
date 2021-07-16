const express = require('express')
const app = express()
const router = express.Router()
const chatController = require('../controllers/chatController')

const helpers = require('../_helpers')

  router.get('/', (req, res) => {
    res.render('index')
  })

// router.use(helpers.authenticated)

router.get('/:roomId', chatController.getContent)



router.post('/', chatController.postMessage)


module.exports = router