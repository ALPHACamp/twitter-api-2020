const { Tweet, User, Like } = require('../models')
const Sequelize = require('sequelize')

const adminServices = {
  // 推文
  getTweets: (req, cb) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => cb(null, tweets))
      .catch(err => cb(err))
  },
  deleteTweet: (req, cb) => {
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error('此推文不存在')
        return tweet.destroy()
      })
      .then(tweet => cb(null, tweet))
      .catch(err => cb(err))
  },
  getUsers: (req, cb) => {
    // 分別撈取User以及Tweet Like數量的資料
    Promise.all([
      User.findAll({
        attributes: {
          include: [
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('tweets.id'))), 'tweetsCounts'],
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Followers.id'))), 'followersCounts'],
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Followings.id'))), 'followingsCounts']
          ]
        },
        include: [
          {
            model: Tweet,
            attributes: []
          },
          {
            model: User,
            as: 'Followers',
            attributes: []
          },
          {
            model: User,
            as: 'Followings',
            attributes: []
          }
        ],
        group: ['User.id'],
        order: [
          [Sequelize.fn('COUNT', Sequelize.col('tweets.id')), 'DESC']
        ],
        nest: true,
        raw: true
      }),
      Tweet.findAll({
        attributes: [
          'UserId',
          [Sequelize.fn('COUNT', Sequelize.col('likes.id')), 'likeCounts']
        ],
        include: [
          {
            model: Like,
            attributes: []
          }
        ],
        group: ['UserId'],
        nest: true,
        raw: true
      })])
      .then(([users, likes]) => {
        // 調整回傳的使用者資料
        const updatedUser = users.map(user => {
          delete user.password
          delete user.Followers
          delete user.Followings
          user.likeCounts = likes.find(x => x.UserId === user.id)?.likeCounts || 0
          return user
        })
        return updatedUser
      })
      .then(users => cb(null, users))
      .catch(err => cb(err))
  }
}
module.exports = adminServices
