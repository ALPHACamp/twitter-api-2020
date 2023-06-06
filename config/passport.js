const passport = require('passport')
const LocalStrategy = require('./strategies/local')
const JtwStrategy = require('./strategies/jwt')

// strategy
LocalStrategy(passport)
JtwStrategy(passport)

module.exports = passport
