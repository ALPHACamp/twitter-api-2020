const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/adminController')

router.get('/', (req, res, next) => {
  res.send('this is /api/admin router.')
})

router.post('/signin', adminController.signIn)
router.delete('/tweets/:tweet_id', adminController.deleteTweet)
router.get('/users', adminController.getUsers)

module.exports = router
