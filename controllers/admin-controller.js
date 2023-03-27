const { User, Tweet } = require('../models')
const Sequelize = require('sequelize')

const helpers = require('../_helpers')

const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      if (!currentUser || currentUser.role === 'user') {
        return res.status(404).json({ status: 'error', message: '此帳戶不存在' })
      }

      const users = await User.findAll({
        attributes: [
          'id',
          'account',
          'name',
          'avatar',
          'cover',
          [Sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'tweetCount'],
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId IN (SELECT id FROM Tweets WHERE Tweets.UserId = User.id))'
            ),
            'likedCount'
          ]
        ],
        include: [
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ],
        order: [[Sequelize.literal('tweetCount'), 'DESC']]
      })

      if (users.length === 0) {
        return res.status(404).json({ status: 'error', message: '找不到任何使用者' })
      }

      const userData = users.map((user) => ({
        id: user.id,
        account: user.account,
        name: user.name,
        cover: user.cover,
        avatar: user.avatar,
        tweetCount: user.get('tweetCount'),
        likedCount: user.get('likedCount'),
        followingCount: user.Followings.length,
        followerCount: user.Followers.length
      }))

      return res.status(200).json(userData)
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        attributes: ['id', 'description', 'createdAt'],
        include: { model: User, attributes: { exclude: ['password'] } },
        order: [['createdAt', 'DESC']]
      })

      if (tweets.length === 0) {
        return res.status(404).json({ status: 'error', message: '找不到任何推文' })
      }

      const tweetData = tweets.map((tweet) => ({
        id: tweet.id,
        description: tweet.description,
        createdAt: tweet.createdAt,
        avatar: tweet.User.avatar,
        name: tweet.User.name,
        account: tweet.User.account
      }))

      return res.status(200).json(tweetData)
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const { tweetId } = req.params

      const tweet = await Tweet.findByPk(tweetId)

      if (!tweet) return res.status(404).json({ status: 'error', message: '此則推文不存在' })

      await tweet.destroy()

      return res.status(200).json({ status: 'success', message: '成功刪除此推文' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
