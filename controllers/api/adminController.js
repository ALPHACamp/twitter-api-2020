/* DB */
const db = require('../../models')
const { User, Tweet, Like, Reply, Sequelize } = db
const { Op } = Sequelize

/* necessary package */
const bcrypt = require('bcryptjs')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const sequelize = require('sequelize')
const adminController = {
  // 登入
  signIn: async (req, res) => {
    try {
      const { account, password } = req.body
      // 檢查必要資料
      if (!account || !password) {
        return res.json({
          status: 'error',
          message: 'Please fill in both Account & Password fields!'
        })
      }
      // 檢查 user 是否存在與密碼是否正確
      const user = await User.findOne({ where: { account } })
      if (!user)
        return res
          .status(401)
          .json({ status: 'error', message: 'Account did NOT exist' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(401)
          .json({ status: 'error', message: 'Passwords is NOT matched' })
      }
      if (user.role !== 'admin') {
        return res
          .status(401)
          .json({ status: 'error', message: 'Permission denied' })
      }
      // 簽發 token
      var payload = { id: user.id }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'Admin login successfully',
        token: token,
        user
      })
    } catch (e) {
      console.log(e)
    }
  },
  // 查看user資訊
  getAdminUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: [
          'account',
          'id',
          'name',
          'avatar',
          'role',
          'cover',
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'
            ),
            'FollowingsCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'
            ),
            'FollowersCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Tweets WHERE Tweets.id = User.id )'
            ),
            'TweetCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Tweets inner join Likes on Tweets.id = Likes.TweetId where Tweets.UserId = User.id)'
            ),
            'likeCounts'
          ]
        ],
        order: [[sequelize.literal('TweetCount'), 'DESC']]
      })
      return res.json(users)
    } catch (err) {
      console.log(err)
    }
  },
  // 查看tweet資訊
  getAdminTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({
        attributes: [
          'id',
          [Sequelize.literal('substring(description,1,50)'), 'description']
        ],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
        ],
        order: [['createdAt', 'DESC']]
      })
      return res.json([tweets])
    } catch (e) {
      console.log(e)
    }
  },
  // 刪除Tweet
  deleteTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) {
        return res.json({
          status: 'error',
          message: 'This tweet did NOT exist'
        })
      }
      await tweet.destroy()
      return res.json({
        status: 'success',
        message: 'Delete tweet successfully'
      })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminController
