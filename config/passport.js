const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize')
const { User, Like, Tweet } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const JWTSecret = process.env.JWT_SECRET || 'SECRET'

// 本地驗證
passport.use(new LocalStrategy({ usernameField: 'account' }, async (account, password, cb) => {
  try {
    const user = await User.findOne({
      where: { account },
      attributes: {
        include: [
          [Sequelize.literal('(SELECT COUNT(*) FROM `Tweets` WHERE `Tweets`.`UserId` = `User`.`id`)'), 'tweetsCount'],
          [Sequelize.literal('(SELECT COUNT(*) FROM `Followships` WHERE `Followships`.`followingId` = `User`.`id`)'), 'followersCount'],
          [Sequelize.literal('(SELECT COUNT(*) FROM `Followships` WHERE `Followships`.`followerId` = `User`.`id`)'), 'followingsCount']
        ]
      },
      raw: true
    })
    if (!user) {
      const err = new Error('帳號不存在！')
      err.status = 404
      throw err
    }
    const result = await bcrypt.compare(password, user.password)
    if (!result) throw new Error('密碼錯誤！')
    delete user.password
    return cb(null, user)
  } catch (err) {
    return cb(err, false)
  }
}))

// 利用 jwtPayload 到資料庫找出 user 並傳入 req.user 供後續使用
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWTSecret
}
passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    const user = await User.findByPk(jwtPayload.id, {
      include: [
        { model: Like, include: Tweet },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    return cb(null, user.toJSON())
  } catch (err) {
    return cb(err, false)
  }
}))

module.exports = passport
