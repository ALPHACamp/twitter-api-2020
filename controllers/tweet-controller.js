const { Tweet, User, Like, Reply, sequelize } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {

    // 當下登入使用者能取得的頁面
    const loginUser = helpers.getUser(req).id

    return Tweet.findAll({
      nest: true,
      raw: true,
      include: {
        model: User,
        attributes: ['id', 'name', 'avatar', 'account']
      },
      attributes: [
        'id',
        [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
        [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
        [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.UserId = ${loginUser} AND Likes.TweetId = Tweet.id)`), 'isLiked']
      ],
      order: [['createdAt', 'DESC']]
    })
    .then(tweet => {
      res.status(200).json(tweet)
    })
    .catch(err => next(err))
  }
}

module.exports = tweetController
