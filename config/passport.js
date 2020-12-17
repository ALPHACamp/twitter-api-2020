const passport = require('passport')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const db = require('../models')
const User = db.User
const Like = db.Like

// set JwtStrategy
let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
  User.findByPk(jwt_payload.id, {
    include: [
      Like,
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  }).then(user => {
    if (!user) return done(null, false)
    return done(null, user)
  })
}))

module.exports = passport

// module.exports = app => {
//   // init Passport 
//   app.use(passport.initialize())

//   // set JwtStrategy
//   let jwtOptions = {}
//   jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
//   jwtOptions.secretOrKey = process.env.JWT_SECRET

//   passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
//     User.findByPk(jwt_payload.id, {
//       include: [
//         Like,
//         { model: User, as: 'Followers' },
//         { model: User, as: 'Followings' }
//       ]
//     }).then(user => {
//       if (!user) return done(null, false)
//       return done(null, user)
//     })
//   }))
// }