const passport = require('passport')
const db = require('../models')
const User = db.User

const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET || 'alphacamp'

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    User.findByPk(jwt_payload.id, {
        include: [
        ]
    }).then(user => {
        if (!user) return next(null, false)
        return next(null, user)
    })
})
passport.use(strategy)

module.exports = passport