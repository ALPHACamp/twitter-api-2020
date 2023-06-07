const jwt = require('jsonwebtoken')

const userController = {
  login: (req, res, next) => {
    try {
      // 製作token給使用者
      const userData = req.user
      delete userData.password

      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      res.status(200).json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUserData: (req, res, next) => {},
  putUserData: (req, res, next) => {},
  getUserTweets: (req, res, next) => {},
  getUserReplies: (req, res, next) => {},
  getUserLikes: (req, res, next) => {},
  getFollowings: (req, res, next) => {},
  getFollowers: (req, res, next) => {}
}
module.exports = userController
