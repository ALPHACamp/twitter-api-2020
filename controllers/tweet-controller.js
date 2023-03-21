const { Tweet, User, sequelize } = require('../models')
const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      attributes: {
        exclude: ['UserId'],
        include: [
          [sequelize.literal('( SELECT COUNT(*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likedCounts'],
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCounts']]
      },
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ]
    })
      .then(tweets => res.status(200).json(tweets))
      .catch(err => next(err))
  }
}
module.exports = tweetController
