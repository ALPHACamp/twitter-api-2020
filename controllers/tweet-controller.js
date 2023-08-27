const { Tweet, User, Reply, sequelize } = require('../models')
const { getUser } = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    console.log('userId:', getUser(req).id)
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
        const data = {
          status: 'success',
          tweets
        }
        return res.json({
          status: 'success',
          data: data
        })
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
        const data = {
          tweet
        }
        return res.json({
          status: 'success',
          data: data
        })
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
  }
}

module.exports = tweetController
