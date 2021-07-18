const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatController')

const helpers = require('../_helpers')

router.get('/', chatController.getContent)
router.use(helpers.authenticated)


router.get('/:roomId', chatController.getContent)



module.exports = router