// const id = require('faker/lib/locales/id_ID')
const { User, Tweet, Like, sequelize } = require('../models')
// model 要記得載入 sequelize
const { getUser } = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        nest: true,
        raw: true,
        include: { model: User, attributes: ['id', 'account', 'name', 'avatar', 'cover'] },
        attributes: [
          'id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'replyCount']
          // 這裡還可以再加上其他 sequelize literal
        ],
        order: [['createdAt', 'DESC']],
      })
      return res.json(tweets)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
