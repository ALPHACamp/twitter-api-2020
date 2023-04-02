const { User, Tweet, Reply, Like, sequelize } = require('../models')
const Sequelize = require('sequelize')

const adminController = {
  getUsers: async (req, res, next) => {
    try {
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
        description: tweet.description.substring(0, 50),
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
    const { tweetId } = req.params
    try {
      // 在 Sequelize ORM 中使用 transaction，要麼全部執行成功，要麼全部執行失敗，以確保資料庫的一致性和完整性
      await sequelize.transaction(async (t) => {
        const tweet = await Tweet.findByPk(tweetId, { include: [Reply, Like] })

        if (!tweet) {
          return res.status(404).json({ status: 'error', message: '此則推文不存在' })
        }

        // 刪除該推文所有回覆
        await Reply.destroy({ where: { TweetId: tweetId } }, { transaction: t })
        // 刪除該推文所有喜歡
        await Like.destroy({ where: { TweetId: tweetId } }, { transaction: t })
        // 最後刪除該推文
        await tweet.destroy({ transaction: t })
      })

      return res.status(200).json({ status: 'success', message: '成功刪除此推文' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
