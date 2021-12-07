/* DB */
const db = require('../../models')
const { User, Tweet, Like, Reply } = db

/* necessary package */
const bcrypt = require('bcryptjs')
// IMGUR
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'e34bbea295f4825'
// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
//helpers
const helpers = require('../../_helpers')

const sequelize = require('sequelize')
const adminController = {
  //登入
  signIn: async (req, res) => {
    try {
      const { email, account, password } = req.body
      // 檢查必要資料
      if (!email || !password) {
        return res.json({
          status: 'error',
          message: "required fields didn't exist"
        })
      }
      // 檢查 user 是否存在與密碼是否正確
      const user = await User.findOne({ where: { email } })
      if (!user)
        return res
          .status(401)
          .json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(401)
          .json({ status: 'error', message: 'passwords did not match' })
      }
      if (user.role !== 'admin') {
        return res
          .status(401)
          .json({ status: 'error', message: 'Permission denied' })
      }
      // 簽發 token
      var payload = { id: user.id }
      var token = jwt.sign(payload, 'alphacamp')
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
  //查看user資訊
  getUsers: async (req, res) => {
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
  getTweets: async (req, res) => {
    try {
      const result = await Tweet.findAndCountAll({ include: [User] })
      const data = await result.rows.map((tweet) => ({
        ...tweet.dataValues,
        description:
          tweet.dataValues.description.length >= 50
            ? tweet.dataValues.description.substring(0, 50) + '...'
            : tweet.dataValues.description
      }))
      return res.json(data)
    } catch (e) {
      console.log(e)
    }
  },
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
