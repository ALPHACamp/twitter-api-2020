const passport = require('passport')
const passportJwt = require('passport-jwt')
const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt
const { User } = require('../models')

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
const strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  try {
    let user = await User.findByPk(jwt_payload.id)
    if (!user) return next(null, false)
    if (user.dataValues.role !== 'admin') {
      user = await User.findByPk(jwt_payload.id, {
        include: { model: User, as: 'Followings', attributes: ['id'], through: { attributes: [] } }
      })
      user = user.toJSON()
      user.Followings = user.Followings.map(following => following.id)
      return next(null, user)
    }
    return next(null, user.toJSON())
  } catch (error) {
    return next(error, false)
  }
})

passport.use(strategy)

module.exports = passport