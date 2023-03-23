const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

// Strategies
passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, account, password, callbackFn) => {
    try {
      const userFind = await User.findOne({ where: { account } })
      if (!userFind) throw new Error('Account or Password error!')
      const isMatch = await bcrypt.compare(password, userFind.password)
      if (!isMatch) throw new Error('Account or Password error!')
      const user = userFind.toJSON()
      delete user.password
      return callbackFn(null, user)
    } catch (err) {
      callbackFn(err)
    }
  }
))
passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, callbackFn) => {
  try {
    const userFind = await User.findByPk(jwtPayload.id, {
      include: [
        { model: User, as: 'Followers', raw:true },
        { model: User, as: 'Followings', raw: true }
      ]
    })
    const { password, ...restUser } = userFind.toJSON()
    const followers = restUser.Followers.map(follower => {
      const { email, password, banner, ...restProps } = follower
      return restProps
    })
    const followings = restUser.Followings.map(following => {
      const { email, password, banner, ...restProps } = following
      return restProps
    })
    const user = {
      ...restUser,
      Followers: followers,
      Followings: followings
    }
    return callbackFn(null, user)
  } catch (err) {
    callbackFn(err)
  }
}))

module.exports = passport
