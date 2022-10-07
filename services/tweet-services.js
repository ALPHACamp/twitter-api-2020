const { Tweet, User, Like, Reply, sequelize } = require('../models')

const tweetServices = {
  getTweets: (req, cb) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [
        { model: Like },
        { model: Reply },
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
        { model: Like },
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        {
          model: Reply,
          attributes: [['id', 'text', 'createdAt']],
          include: { model: User, attributes: ['id', 'name', 'avatar', 'account'] }
        }
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
