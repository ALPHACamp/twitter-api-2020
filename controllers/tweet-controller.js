const { Tweet, User, Reply, sequelize } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      attributes: [
        'id', 'description', 'createdAt', 'updatedAt', 'userId',
        [sequelize.literal('(SELECT COUNT (*) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likedCount']
      ],
      raw: true,
      nest: true
    })
      .then(tweets => {
        return res.json(
          tweets
        )
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const tweetId = req.params.id
    return Tweet.findByPk(tweetId, {
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      attributes: [
        'id', 'description', 'createdAt', 'updatedAt', 'userId',
        [sequelize.literal('(SELECT COUNT (*) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likedCount']
      ],
      raw: true,
      nest: true
    })
      .then(tweet => {
        return res.json(
          tweet
        )
      })
      .catch(err => next(err))
  },
  getTweetReplies: (req, res, next) => {
    const tweetId = req.params.tweetId
    Promise.all([
      Reply.findAll({
        where: { tweetId: tweetId },
        order: [['createdAt', 'ASC']],
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        raw: true,
        nest: true
      }),
      Tweet.findByPk(tweetId, {
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        raw: true,
        nest: true
      })
    ])
      .then(([replies, tweet]) => {
        const data = {
          replies,
          tweetUserAccount: tweet.User.account
        }
        return res.json({
          status: 'success',
          data: data
        })
      })
      .catch(err => next(err))
  },
  postTweet: async (req, res, next) => {
    const { description } = req.body
    const userId = helpers.getUser(req).id
    if (!description) throw new Error('內容不可空白')
    if (description.length > 140) throw new Error('內容不可超過 140 字')
    return Tweet.create({
      description,
      userId
    })
      .then(tweet => {
        return res.json({
          status: 'success',
          tweet
        })
        // res.status(200).json(postTweet)
      })
      .catch(err => next(err))
  },
  postTweetReply: (req, res, next)
}

module.exports = tweetController
