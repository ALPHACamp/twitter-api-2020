const { User, Tweet, sequelize } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const currentUserId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(tweetId, {
        nest: true,
        raw: true,
        include:
          { model: User, attributes: ['id', 'account', 'name', 'avatar', 'cover'] },
        attributes: [
          'id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'LikeCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.tweet_id = Tweet.id AND Likes.user_id = ${currentUserId})`), 'ifLiked']
        ],
        order: [['createdAt', 'DESC']]
      })
      return res.status(200).json({ tweet })
    } catch (err) { next(err) }
  },
  // getTweetReplies: async (req, res, next) => {
  //   try {
  //     const tweetId = req.params.id
  //     const tweet = await Tweet.findByPk(tweetId)
  //     if (!tweet) {
  //       return res.status(404).json({ status: 'error', message: 'tweet did not exist!' })
  //     }
  //     const replies = await Reply.findAll({
  //       nest: true,
  //       raw: true,
  //       attributes: ['id', 'comment', 'createdAt'],
  //       include: {
  //         model: User,
  //         attributes: ['id', 'account', 'name', 'avatar']
  //       },
  //       where: { TweetId: tweetId }
  //     })
  //     return res.status(200).json(replies)
  //   } catch (err) { next(err) }
  // },
  // postTweetReply: (req, res, next) => {
  //   const { comment } = req.body
  //   const tweetId = req.params.id
  //   const currentUserId = helpers.getUser(req).id
  //   if (!comment) throw Error('content is required!', {}, Error.prototype.code = 401)
  //   if (comment.length > 140) throw Error('too many words!', {}, Error.prototype.code = 401)
  //   Reply.create({
  //     UserId: currentUserId,
  //     TweetId: tweetId,
  //     comment
  //   })
  //     .then(reply => {
  //       res.status(200).json(reply)
  //     })
  //     .catch(err => next(err))
  // },
  getTweets: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const tweets = await Tweet.findAll({
        nest: true,
        raw: true,
        include: { model: User, attributes: ['id', 'account', 'name', 'avatar', 'cover'] },
        attributes: [
          'id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'LikeCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.tweet_id = Tweet.id AND Likes.user_id = ${currentUserId})`), 'ifLiked']
        ],
        order: [['createdAt', 'DESC']]
      })
      return res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  postTweets: (req, res, next) => {
    const currentUserId = helpers.getUser(req).id
    const { description } = req.body
    if (!description) throw Error('content is required!', {}, Error.prototype.code = 401)
    if (description.length > 140) throw Error('too many words!', {}, Error.prototype.code = 401)
    Tweet.create({
      UserId: currentUserId,
      description
    })
      .then(tweet => {
        res.status(200).json(tweet)
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
