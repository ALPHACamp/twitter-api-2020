const jwt = require('jsonwebtoken')
const { User, Tweet } = require('../models')
const sequelize = require('sequelize')

const adminController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
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
  getAllUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        // where: { role: 'user' }, //測試後發現不需限定只抓user
        // profile以外的值都直接傳「counts」（不要detail）給前端
        attributes: [
          'id',
          'name',
          'avatar',
          'account',
          'banner',
          'role',
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'
            ),
            'tweetCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = User.id AND Likes.deletedAt IS NULL)'
            ),
            'likeCount'
          ],
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
          ]
        ],
        order: [[sequelize.literal('tweetCount'), 'DESC']] // ac規格：按推文數排序
      })

      const allUsersData = users.map(user => {
        const userData = user.toJSON()
        return {
          ...userData
        }
      })
      res.status(200).json(allUsersData)
    } catch (err) {
      next(err)
    }
  },
  getAllTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          {
            model: User,
            attributes: {
              exclude: ['password']
            }
          }
        ],
        attributes: {
          include: [
            [ // AC規格：快覽 Tweet 的前 50 個字
              sequelize.literal('SUBSTRING(`Tweet`.`description`, 1, 50)'),
              'description'
            ]
          ]
        },
        order: [['createdAt', 'DESC']],
        nest: true
      })
      const tweetsData = tweets.map(tweet => ({
        ...tweet.toJSON()
      }))
      res.status(200).json(tweetsData)
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.tweetId
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) {
        throw new Error("Tweet didn't exist!")
      }
      await tweet.destroy()
      res.status(200).json({
        status: 'success',
        message: 'This tweet has been deleted successfully',
        tweetId
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
