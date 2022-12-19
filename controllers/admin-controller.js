const { User, Tweet, sequelize } = require('../models')
const { dateFormat } = require('../helpers/date-helper')

const adminController = {
  getUsers: (req, res, next) => {
    return User.findAll({
      attributes: {
        exclude: ['password'],
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id )'), 'tweetCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = User.id )'), 'likeCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id )'), 'followerCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id )'), 'followingCount']
        ]
      },
      order: [
        [sequelize.literal('tweetCount'), 'DESC']
      ],
      raw: true
    })
      .then(users => {
        res.json(users)
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [
        {
          model: User,
          attributes: {
            exclude: ['password']
          }
        }],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        const tweetsData = tweets.map(tweet => ({
          ...tweet,
          description: tweet.description.substring(0, 50),
          relativeTime: dateFormat(tweet.createdAt).fromNow()
        }))
        res.json(tweetsData)
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          const err = new Error("Tweet didn't exist!")
          err.status = 404
          throw err
        }
        return tweet.destroy()
      })
      .then(deletedTweet => res.json({ tweet: deletedTweet }))
      .catch(err => next(err))
  }
}

module.exports = adminController
