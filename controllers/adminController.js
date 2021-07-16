const db = require('../models')
const { User, Tweet, Like, Reply, Sequelize } = db
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
        [Sequelize.fn('COUNT', Sequelize.col('Tweets.UserId')), 'tweetCount'],
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

        return Promise.all([
          tweet.destroy(),
          Reply.destroy({
            where: {
              TweetId: {
                [Op.in]: [tweetId],
              }
            }
          }),
          Like.destroy({
            where: {
              TweetId: {
                [Op.in]: [tweetId],
              }
            }
          })
        ]).then(result => {
          return res.status(200).json({
            status: 'success',
            message: `Tweet.id ${result[0].id} and associate replies and likes have been destroyed successfully.`
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
  }
}
module.exports = adminController
