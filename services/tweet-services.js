const { Tweet, User, Like, sequelize } = require('../models')
const { getUser } = require('../_helpers')

const tweetServices = {
  getTweets: (req, cb) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      attributes: {
        include: [
          [sequelize.literal('( SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'likedCount'],
          [sequelize.literal('( SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'repliedCount']
        ]
      },
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => cb(null, { tweets }))
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      attributes: {
        include: [
          [sequelize.literal('( SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'likedCount'],
          [sequelize.literal('( SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'repliedCount']
        ]
      },
      order: [['createdAt', 'DESC']]
    })
      .then(tweet => cb(null, { tweet }))
      .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    return Tweet.create({
      description: req.body.description,
      UserId: getUser(req).dataValues.id
    })
      .then(tweet => cb(null, tweet))
      .catch(err => cb(err))
  },
  likeTweet: (req, cb) => {
    const TweetId = req.params.id
    const UserId = getUser(req).dataValues.id
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: {
          TweetId,
          UserId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        if (like) throw new Error('You have liked this tweet!')

        return Like.create({
          TweetId,
          UserId
        })
      })
      .then(like => cb(null, like))
      .catch(err => cb(err))
  },
  unlikeTweet: (req, cb) => {
    return Like.findOne({
      where: {
        TweetId: req.params.id,
        UserId: getUser(req).dataValues.id
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this tweet!")
        return like.destroy()
      })
      .then(like => cb(null, like))
      .catch(err => cb(err))
  }
}

module.exports = tweetServices
