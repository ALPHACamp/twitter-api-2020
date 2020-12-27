const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('public', { page: 'public-chat' })
})

router.get('/private', (req, res) => {
  res.render('private', { page: 'private-chat' })
})

router.get('/:userId', (req, res) => {
  res.render('private', { page: 'private-chat' })
})


module.exports = router