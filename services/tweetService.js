const db = require('../models')
const { Tweet, User, Reply, Like, sequelize } = db
const helpers = require('../_helpers')

const tweetService = {
  getTweets: (req, res, callback) => {
    return Tweet.findAll({
      include: [User, { model: User, as: 'LikedUsers' }],
      order: [['createdAt', 'DESC']]
    }).then((data) => {
      const tweets = data.map((tweet) => ({
        ...tweet.dataValues,
        name: tweet.User.name,
        avatar: tweet.User.avatar,
        account: tweet.User.account,
        isLiked: tweet.LikedUsers.map((i) => i.id).includes(
          helpers.getUser(req).id
        )
      }))
      callback(tweets)
    })
  },
  postTweet: (req, res, callback) => {
    const { description } = req.body
    if (!description.trim()) {
      return callback({ status: 'error', message: 'Content can NOT be empty!' })
    } else if (description.length > 140) {
      return callback({
        status: 'error',
        message: 'Content should be within 140 characters!'
      })
    } else {
      return Tweet.create({
        UserId: helpers.getUser(req).id,
        description
      }).then((tweet) => {
        callback({ tweet })
      })
    }
  },
  getTweet: (req, res, callback) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: User, as: 'LikedUsers' },
        { model: Reply, include: [User] }
      ],
      order: [['Replies', 'createdAt', 'DESC']]
    }).then((tweet) => {
      // const isLiked = tweet.LikedUsers.map((d) => d.id).includes(
      //   helpers.getUser(req).id
      // )
      callback(tweet)
    })
  }
}

module.exports = tweetService
