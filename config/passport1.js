const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const jwtStrategy = passportJWT.Strategy
const db = require('../models')
const User = db.User
const ADMIN_KEY = 'process.env.ADMIN_KEY'
const passport = require('passport')

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ADMIN_KEY //保留公鑰系統命名方式
}

passport.use(new jwtStrategy(options, async (payload, done) => {
  try {
    const user = await User.findByPk(payload.sub)
    if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  }
  catch (error) {
    console.log(error)
  }
})
)

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => done(null, err))
});

module.exports = passport