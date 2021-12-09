/* DB */
const db = require('../../models')
const { User, Tweet, Reply, Like } = db

/* necessary package */
const bcrypt = require('bcryptjs')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const sequelize = require('sequelize')
const { Op } = sequelize
const adminController = {
  // 登入
  signIn: async (req, res) => {
    try {
      const { account, password } = req.body
      // 檢查必要資料
      if (!account || !password) {
        return res.json({
          status: 'error',
          message: '帳號及密碼皆不可空白'
        })
      }
      // 檢查 user 是否存在與密碼是否正確
      const user = await User.findOne({ where: { account } })
      if (!user)
        return res.status(401).json({ status: 'error', message: '帳號不存在' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '密碼錯誤' })
      }
      if (user.role !== 'admin') {
        return res.status(401).json({ status: 'error', message: '帳號不存在' })
      }
      // 簽發 token
      var payload = { id: user.id }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: '管理者登入成功',
        token: token,
        user
      })
    } catch (err) {
      console.log(err)
    }
  },
  // 查看user資訊
  getAdminUsers: async (req, res) => {
    try {
      let users = await User.findAll({
        attributes: [
          'account',
          ['id', 'UserId'],
          'name',
          'avatar',
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
              '(SELECT COUNT(*) FROM Tweets WHERE Tweets.Userid = User.id )'
            ),
            'TweetsCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Tweets inner join Likes on Tweets.id = Likes.TweetId where Tweets.UserId = User.id)'
            ),
            'LikesCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Tweets inner join Replies on Tweets.id = Replies.TweetId where Tweets.UserId = User.id)'
            ),
            'RepliesCount'
          ]
        ],
        where: {
          role: {
            [Op.or]: {
              [Op.ne]: 'admin',
              [Op.eq]: null //for test
            }
          }
        },
        order: [[sequelize.literal('TweetsCount'), 'DESC'], ['name']]
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
          ['id', 'TweetId'],
          'createdAt',
          [Sequelize.literal('substring(description,1,50)'), 'description']
        ],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
        ],
        order: [['createdAt', 'DESC']]
      })
      return res.json(tweets)
    } catch (err) {
      console.log(err)
    }
  },
  // 刪除Tweet
  deleteTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) {
        return res.json({
          status: 'error',
          message: '要刪除的推文不存在'
        })
      }
      await tweet.destroy()
      await Reply.destroy({ where: { TweetId: tweet.id } })
      await Like.destroy({ where: { TweetId: tweet.id } })
      return res.json({
        status: 'success',
        message: '成功刪除推文'
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = adminController
