const sequelize = require('sequelize')
const { User, Tweet, Reply, Like } = require('../models')

const adminService = {
  getTweets: (req, res, cb) => {
    Tweet.findAll({ include: { model: User }, raw: true, nest: true, order: [['createdAt', 'DESC']] })
      .then(tweets => {
        tweets = tweets.map(tweet => ({
          ...tweet,
          description: tweet.description.substring(0, 50)
        }))
        return cb({ tweets, status: '200' })
      })
      .catch(error => res.status(422).json(error))
  },
  removeTweet: (req, res, cb) => {
    TweetId = req.params.id
    return Promise.all([
      Tweet.destroy({ where: { id: TweetId } }),
      Like.destroy({ where: { TweetId } }),
      Reply.destroy({ where: { TweetId } })
    ])
      .then(([tweet, like, reply]) => {
        cb({ tweet, like, reply, status: '200' })
      })
      .catch(error => res.status(422).json(error))
  },
  getUsers: async (req, res, cb) => {
    try {
      const users = await User.findAll({
        raw: true, nest: true,
        where: { role: { [sequelize.Op.not]: 'admin' } },
        attributes: ['id', 'name', 'email', 'role', 'account', 'avatar', 'cover',
          [sequelize.literal('COUNT(DISTINCT Tweets.id)'), 'tweetsCount'],
          [sequelize.literal('COUNT(DISTINCT Likes.id)'), 'likesCount'],
          [sequelize.literal('COUNT(DISTINCT Followers.id)'), 'followingsCount'],
          [sequelize.literal('COUNT(DISTINCT Followings.id)'), 'followersCount']
        ],
        group: 'User.id',
        include: [
          { model: Tweet, attributes: [] },
          { model: Like, attributes: [] },
          { model: User, as: 'Followers', attributes: [], through: { attributes: [] } },
          { model: User, as: 'Followings', attributes: [], through: { attributes: [] } }
        ],
        order: [
          [sequelize.literal('tweetsCount'), 'DESC'],
          ['id', 'ASC']
        ],
      })
      return cb({ users, status: '200' })
    } catch (error) {
      console.warn(error)
      return res.status(422).json(error)
    }
  }
}

module.exports = adminService
