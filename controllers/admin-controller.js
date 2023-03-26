const { User } = require('../models')
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
  }
}

module.exports = adminController
