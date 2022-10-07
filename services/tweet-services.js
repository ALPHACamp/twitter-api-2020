const { Tweet, User, sequelize } = require('../models')

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
  }
}

module.exports = tweetServices
