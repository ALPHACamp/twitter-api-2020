const db = require('../models')
const { Reply, Like, User, Tweet, Sequelize } = db
const { Op } = Sequelize
const RequestError = require('../libs/RequestError')

const adminService = {
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
      return users
    })
  },

  deleteTweet: (tweetId) => {
    return Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) {
          throw new RequestError('Tweet does not exist')
        }

        return Promise.all([
          tweet.destroy(),
          Reply.destroy({
            where: {
              TweetId: {
                [Op.in]: [tweetId]
              }
            }
          }),
          Like.destroy({
            where: {
              TweetId: {
                [Op.in]: [tweetId]
              }
            }
          })
        ]).then(result => {
          return {
            status: 'success',
            message: `Tweet.id ${result[0].id} and associate replies and likes have been destroyed successfully.`
          }
        })
      })
  },
}

module.exports = adminService
