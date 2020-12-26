const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('chat', { page: 'public-chat' })
})

router.get('/private', (req, res) => {
  res.render('private-chat', { page: 'private-chat', home: true })
})

router.get('/:userId', (req, res) => {
  res.render('private-chat', { page: 'private-chat' })
})


module.exports = router