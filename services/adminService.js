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
  getUsers: (req, res, cb) => {
    User.findAll({
      group: 'User.id',
      attributes: ['id', 'name', 'email', 'role', 'account', 'avatar', 'cover',
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('tweets.id'))), 'tweetsCount'],
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('likes.id'))), 'likesCount'],
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Followings.Followship.followingId'))), 'followingsCount'],
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Followers.Followship.followerId'))), 'followersCount']
      ],
      include: [
        { model: Tweet, attributes: [] },
        { model: Like, attributes: [] },
        { model: User, as: 'Followings', attributes: [] },
        { model: User, as: 'Followers', attributes: [] }
      ],
      order: [[sequelize.col('tweetsCount'), 'DESC']],
      raw: false, nest: true
    })
      .then(users => {
        cb({ users: users, status: '200' })
      })
      .catch(error => res.status(422).json(error))
  }
}

module.exports = adminService
