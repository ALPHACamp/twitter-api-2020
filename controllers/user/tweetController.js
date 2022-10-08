const { Tweet, User, Like, Reply } = require('../../models')
const { tweetValidation } = require('../../helper/validations')
const helpers = require('../../_helpers')

const tweetController = {
  addTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const { value } = tweetValidation(req.body)
      const { description } = value
      if (!description.trim()) throw new Error('內容不可空白')
      const data = await Tweet.create({ 
        UserId,
        description
       })
      return res.json({ status: 'success', data })
    } catch(error) {
      next(error)
    }
  },
  getAllTweets: async (req, res, next) => {
    try {
      const data = await Tweet.findAll({
        include: User,
        order: [['createdAt', 'DESC']], 
        nest: true,
        raw: true
      })
      return res.json(data)
    } catch (error) {
      next(error)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const [ tweetData, likeData, replyData ] = await Promise.all([
        Tweet.findByPk(tweetId, {
          include: User,
          nest: true,
          raw: true
        }),
        Like.findAll({ where: { tweetId } }),
        Reply.findAll({ where: { tweetId } })
      ])
      tweetData.likeCount = likeData.length
      tweetData.replyCount = replyData.length
      // return res.json({ status: 'success', data: tweetData })
      return res.json(tweetData)
    } catch(error) {
      next(error)
    }
  }
}

module.exports = tweetController
