const { User, Tweet, Reply, Like, sequelize } = require('../models')
const helpers = require('../_helpers')
<<<<<<< HEAD
=======
const dayjs = require('dayjs')
>>>>>>> 1609435b036c0f9e17c09af833fdee22d5340325
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
<<<<<<< HEAD
      return res.status(200).json(tweets)
=======
      const data = tweets.map(tweet => ({ ...tweet, createdAt: dayjs(tweet.createdAt).valueOf() }))
      return res.status(200).json(data)
>>>>>>> 1609435b036c0f9e17c09af833fdee22d5340325
    } catch (err) { next(err) }
  }
}

module.exports = tweetController
