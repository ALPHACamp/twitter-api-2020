// const id = require('faker/lib/locales/id_ID')
const { User, Tweet, Like, sequelize } = require('../models')
// const { getUser } = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        nest: true,
        raw: true,
        include: {
          model: User,
          attributes: ['id', 'account', 'name', 'avatar', 'cover']
        }
      })
      const repliesCount = await Tweet.findAll({
        attributes: [
          'id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.tweetId = Tweet.id)'), 'replyCount']
        ],
        order: [['createdAt', 'DESC']]
      })
      return res.json(tweets, repliesCount)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
