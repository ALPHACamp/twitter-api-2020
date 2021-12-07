const db = require('../../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const helper = require('../../_helpers')
const jwt = require('jsonwebtoken')
const { sequelize } = require('../../models')
const bcrypt = require('bcryptjs')

const adminController = {
  signIn: (req, res) => {
    // 檢查必要資料
    if (!req.body.account || !req.body.password) {
      return res
        .status(400)
        .json({ status: 'error', message: "required fields didn't exist" })
    }
    User.findOne({ where: { account: req.body.account } }).then(user => {
      if (!user) {
        //if user is not exist
        return res
          .status(400)
          .json({ status: 'error', message: 'user is not exist.' })
      }
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res //if password not match
          .status(400)
          .json({ status: 'error', message: 'email or password incorrect.' })
      }
      if (user.role !== 'admin') {
        return res
          .status(400)
          .json({ status: 'error', message: '不允許一般用戶登錄！' })
      }
      // 簽發 token
      var payload = { id: user.id }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 200,
        message: 'pass',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          account: user.account,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      })
    })
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        where: { role: null },
        raw: true,
        nest: true,
        include: [
          { model: Tweet, attributes: [] },
          { model: Like, attributes: [] }
        ],
        attributes: [
          [sequelize.col('User.id'), 'userId'],
          [sequelize.col('User.name'), 'name'],
          [sequelize.col('User.cover'), 'cover'],
          [sequelize.col('User.avatar'), 'avatar'],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Tweets INNER JOIN Likes ON Tweets.id = Likes.TweetId WHERE Tweets.UserId = User.id)'
            ),
            'likeCount'
          ],
          [
            sequelize.fn(
              'COUNT',
              sequelize.fn('DISTINCT', sequelize.col('tweets.id'))
            ),
            'tweetsCount'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)`
            ),
            `followingsCount`
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)`
            ),
            `followersCount`
          ]
        ],
        group: ['User.id'],
        order: [
          [sequelize.literal('tweetsCount DESC')],
          [sequelize.literal('name ASC')] //推文一樣時，依userName排序
        ]
      })
      return res.status(200).json(users)
    } catch (err) {
      console.log(err)
      return res.status(400).json({ status: 'error', message: err })
    }
  },
  getTweets: async (req, res) => {
    const tweets = await Tweet.findAll({
      raw: true,
      nest: true,
      include: [{ model: User, attributes: [] }],
      attributes: {
        include: [
          [sequelize.col('User.name'), 'UserName'],
          [sequelize.col('User.account'), 'UserAccount'],
          [sequelize.col('User.id'), 'UserId'],
          [sequelize.col('User.avatar'), 'UserAvatar']
        ]
      }
    })
    return res.status(200).json({ tweets })
  },
  deleteTweet: async (req, res) => {
    try {
      const tweet = await Tweet.destroy({ where: { id: req.params.id } })
      return res.status(200).json({ message: '刪除成功' })
    } catch (err) {
      console.log(err)
      return res.status(401).json(err)
    }
  }
}

module.exports = adminController
