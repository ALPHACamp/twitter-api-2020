const jwt = require('jsonwebtoken')
const { User, sequelize } = require('../models')
const passport = require('../config/passport')
const helpers = require('../_helpers')

// use helpers.getUser(req) to replace req.user
const authenticated = (req, res, next) => {}

module.exports = authenticated
