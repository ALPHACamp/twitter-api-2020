const { Tweet, User, Like, Reply, sequelize } = require('../models')
const { getUser } = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {

    const loginUser = getUser(req).toJSON().id

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
    .then(tweet => res.status(200).json(tweet))
    .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const limitWords = 140
    const { description } = req.body
    const userId = getUser(req).id

    if (!userId) throw new Error('帳號不存在！')
    if (!description.trim()) throw new Error('內容不可空白')
    if (description.length > limitWords ) throw new Error(`字數不能大於 ${limitWords} 字`)
    
    return Tweet.create({
      description,
      userId
    })
    .then(tweet => {
      res.status(200).json(tweet)
    })
    .catch(err => next(err))
  }
}

module.exports = tweetController
