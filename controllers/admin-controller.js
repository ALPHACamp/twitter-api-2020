const jwt = require('jsonwebtoken')
const db = require('../models')
const { User, Tweet, Like, Reply } = db
const sequelize = require('sequelize')
const helpers = require('../_helpers')

const adminController = {
  login: (req, res, next) => {
    try {
      // 製作token給管理員
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
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: {
          exclude: ['password'],
          include: [
            [
              sequelize.literal(
                '(SELECT COUNT(*) FROM Followships WHERE followingId = User.id)'
              ),
              'followersCount'
            ],
            [
              sequelize.literal(
                '(SELECT COUNT(*) FROM Followships WHERE followerId = User.id)'
              ),
              'followingsCount'
            ],
            [
              sequelize.literal(
                '(SELECT COUNT(*) FROM Tweets WHERE UserId = User.id)'
              ),
              'tweetsCount'
            ]
            // 因跑 travis 會有問題暫時拿掉
            // [
            //   sequelize.literal(
            //     '(SELECT COUNT(*) FROM likes l INNER JOIN tweets t on l.TweetId = t.id INNER JOIN users u on t.UserId=u.id where t.UserId = User.id group by t.UserId)'
            //   ),
            //   'receivedLikesCount'
            // ]
          ]
        },
        order: [[sequelize.literal('TweetsCount'), 'DESC']]
      })

      // reorganize users data
      const usersData = users.map(user => {
        const userData = user.toJSON()
        return {
          ...userData
          // 因跑 travis 會有問題暫時拿掉
          // receivedLikesCount: userData.receivedLikesCount ? userData.receivedLikesCount : 0
        }
      })

      res.status(200).json(usersData)
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      // 確認是否為admin身分
      const isCurrentUserAdim = helpers.getUser(req).role === 'admin'
      if (!isCurrentUserAdim) throw new Error('您沒有權限刪除推文')

      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) throw new Error('推文不存在!')
      await Reply.destroy({ where: { TweetId: req.params.id } })
      await Like.destroy({ where: { TweetId: req.params.id } })

      await tweet.destroy()
      res.status(200).json({
        status: 'success',
        message: '成功刪除推文'

      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
