const router = require('express').Router()
const userController = require('../../controllers/pages/user-controller')

// heroku test
router.get('/', (req, res) => {
  res.json({ status: 'Hello world!' })
})

router.get('/logout', userController.logout)

module.exports = router
