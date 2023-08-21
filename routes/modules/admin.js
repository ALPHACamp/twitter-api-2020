const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.post('/signIn', adminController.signIn)
router.get('/users', adminController.getUsers)
router.delete('/tweets/:id', adminController.deleteTweet)
router.get('/tweets', adminController.getTweets)

router.use('/', (req, res) => res.redirect('api/admin/users'))

module.exports = router
