const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated } = require('../../middleware/auth')


router.post('/', authenticated,followshipController.postFollow)
router.delete('/:followingId', authenticated, followshipController.deleteFollow)

router.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
})
router.use('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
})
router.use('/', apiErrorHandler)


module.exports = router