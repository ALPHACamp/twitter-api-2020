const db = require('../models')
const { User, Tweet, Sequelize } = db
const { Op } = require('sequelize')

const tweetService = require('../services/tweetService')
const userService = require('../services/userService')

const adminController = {

  getUsers: (req, res) => {
    return User.findAll({
      where: {
        [Op.or]: [
          { role: { [Op.ne]: 'admin' } },
          { role: { [Op.is]: null } }
        ]
      },
      attributes: [
        'id', 'account', 'name', 'avatar', 'cover', 'followerCount', 'followingCount',
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'tweetCount'],
        [Sequelize.fn('SUM', Sequelize.col('Tweets.likeCount')), 'likeCount']
      ],
      include: [
        {
          model: Tweet, attributes: []
        }
      ],
      order: [[Sequelize.literal('tweetCount'), 'DESC']],
      group: 'id'
    }).then(users => {
      res.status(200).json(users)
    })
  },

  deleteTweet: (req, res) => {
    const tweetId = req.params.id

    return Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) {
          return res.status(400).json({
            status: 'error',
            message: 'Tweet does not exist'
          })
        }

        return tweet.destroy()
          .then(tweetDeleted => {
            return res.status(200).json({
              status: 'success',
              message: `Tweet.id ${tweetDeleted.id} has been destroyed successfully`
            })
          })
      })
  },
  getTweets: (req, res) => {
    const viewerId = req.user.id
    tweetService.getTweets(viewerId, 'admin')
      .then(data => {
        return res.status(200).json(data)
      })
  },
  getUser: (req, res) => {
    const UserId = req.params.id
    userService.getUser(req, res, 'admin', UserId)
      .then(data => { return data })
  },
  getUserTweets: (req, res) => {
    const UserId = req.params.id
    userService.getUserTweets(req, res, 'admin', UserId)
      .then(data => { return data })
  },
  getUserLikes: (req, res) => {
    const UserId = req.params.id
    userService.getUserLikes(req, res, 'admin', UserId)
      .then(data => { return data })
  },
  getUserFollowings: (req, res) => {
    const UserId = req.params.id
    userService.getUserFollowings(req, res, 'admin', UserId)
      .then(data => { return data })
  },
  getUserFollowers: (req, res) => {
    const UserId = req.params.id
    userService.getUserFollowers(req, res, 'admin', UserId)
      .then(data => { return data })
  },
  getUserRepliedTweets: (req, res) => {
    const UserId = req.params.id
    userService.getUserRepliedTweets(req, res, 'admin', UserId)
      .then(data => { return data })
  }
}
module.exports = adminController
