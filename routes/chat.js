const express = require('express')
const app = express()
const router = express.Router()
const chatController = require('../controllers/chatController')

const helpers = require('../_helpers')

// router.get('/3', (req, res) => {
//   chatController.getContent(req, res, (data) => {
//     res.render('join2', { data })
//   })
// })
// router.get('/2', (req, res) => {
//   res.render('join')
// })

router.get('/', (req, res) => {
  chatController.getContent(req, res, (data) => {
    res.render('index', { data })
  })
  // res.render('index')
})

// router.use(helpers.authenticated)

router.get('/:roomId', chatController.getContent)



router.post('/', chatController.postMessage)


module.exports = router