const express = require('express')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticatedAdmin } = require('../../middleware/auth')
const adminController = require('../../controllers/admin-controller')

router.post('/signin', adminController.adminSignIn)
router.delete('/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
router.get('/tweets', authenticatedAdmin, adminController.getTweets)
router.get('/users', authenticatedAdmin, adminController.getUsers)

router.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
})
router.use('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
})
router.use('/', apiErrorHandler)


module.exports = router
