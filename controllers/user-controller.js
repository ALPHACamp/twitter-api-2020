const { User, Tweet, Reply, Like, Followship } = require('../models')
const { getUser } = require('../_helpers')
const jwt = require('jsonwebtoken')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        token,
        user: userData
      })
    } catch (err) {
      next(err)
    }
  },
  // 瀏覽 CurrentUser Profile：tweetCount, followerCount, followingCount
  getCurrentUser: (req, res, next) => {
    return User.findByPk(getUser(req).id, {
      include: [
        { model: Tweet },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.json({ currentUser: getUser(req) })
      })
      .catch(err => next(err))
  }
}
module.exports = userController
