const { User, Tweet, Reply, Like, sequelize } = require('../models')
const helpers = require('../_helpers')
const dayjs = require('dayjs')
const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const loginUser = helpers.getUser(req)
      const tweets = await Tweet.findAll({
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        attributes: ['id', 'description', 'createdAt'],
        where: { UserId: loginUser?.id },
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
      const data = tweets.map(tweet => ({ ...tweet, createdAt: dayjs(tweet.createdAt).valueOf() }))
      return res.status(200).json(data)
    } catch (err) { next(err) }
  }
}

module.exports = tweetController
