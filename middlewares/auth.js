const jwt = require('jsonwebtoken')
const { User } = require('../models')
const passport = require('../config/passport')
const helpers = require('../_helpers')

// use helpers.getUser(req) to replace req.user
const authenticated = passport.authenticate('jwt', { session: false })

module.exports = authenticated
