const { Tweet, User, Like, Reply } = require('../models')
const sequelize = require('sequelize')

const adminController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      raw: true,
      nest: true
    })
      .then(tweets => {
        const data = tweets.map(t => ({
          ...t,
          description: t.description.substring(0, 50)
        }))
        return res.json(
          data
        )
      })
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      attributes: [
        'id', 'name', 'account', 'avatar', 'cover',
        [sequelize.literal('(SELECT COUNT (*) FROM Tweets WHERE Tweets.user_id = User.id)'), 'tweetCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.user_id = User.id)'), 'followerCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Tweets INNER JOIN Likes ON Tweets.id = Likes.tweet_id WHERE Tweets.user_id = User.id)'), 'tweetLikeCount']
      ],
      order: [
        [sequelize.literal('tweetCount'), 'DESC']
      ],
      raw: true,
      nest: true
    })
      .then(users => {
        return res.json(users)
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    const id = req.params.id
    Tweet.findByPk(id)
      .then(tweet => {
        if (!tweet) throw new Error('推文不存在！')
        return Promise.all([
          tweet.destroy(),
          Like.destroy({
            where: { tweetId: id }
          }),
          Reply.destroy({
            where: { tweetId: id }
          })
        ])
      })
      .then(() => {
        return res.json({
          status: 'success',
          message: '成功刪除此貼文'
        })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
