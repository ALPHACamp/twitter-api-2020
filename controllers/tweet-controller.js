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
  // 資料格式未確認
  getTweetReplies: (req, res, next) => {
    const tweetId = req.params.tweetId
    Promise.all([
      Reply.findAll({
        where: { tweetId },
        order: [['createdAt', 'ASC']],
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
      }),
      Tweet.findByPk(tweetId, {
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
      })
    ])
      .then(([replies, tweet]) => {
        replies = replies.map(reply => {
          reply = {
            ...reply.toJSON(),
            repliesAccount: tweet.User.account
          }
          return reply
        })
        return res.json(
          [replies]
        )
      })
      .catch(err => next(err))
  },
  // 資料格式未確認
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
      })
      .catch(err => next(err))
  },
  // 資料格式未確認
  postTweetReply: (req, res, next) => {
    const { tweetId } = req.params
    const userId = helpers.getUser(req)
    const { comment } = req.body
    return Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) throw new Error('Tweet not found.')
        return Reply.create({
          comment,
          user_id: userId,
          tweet_id: tweet.id
        })
          .then(reply => {
            return res.json({
              status: 'success',
              message: '成功貼出留言'
            })
          })
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
