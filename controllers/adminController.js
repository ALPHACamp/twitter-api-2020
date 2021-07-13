const db = require('../models')
const { User, Tweet, Sequelize } = db
const { Op } = require('sequelize')

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
      group: 'id',
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
  }
}

module.exports = adminController