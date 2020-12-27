const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers.js')
const { User } = require('../models')
const bcrypt = require('bcryptjs')

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