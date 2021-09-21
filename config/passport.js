const jwtStrategy = require('passport-jwt').Strategy
const db = require('../models')
const User = db.User
const fs = require('fs')
const PUB_KEY = process.env.tokenKey || fs.readFileSync(__dirname + '/../rsaPublicKey.pem', 'utf8')
const passport = require('passport')

const cookieExtractor = (req) => {
  let token = null
  if (req && req.cookies['jwt']) {
    token = req.cookies['jwt']['token']
  } 
  return token
}

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: PUB_KEY,
  // algorithms: ['RS256']
}

// module.exports = (passport) => {
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
// }
module.exports = passport
