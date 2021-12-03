const db = require('../models')
const { Tweet, User, Reply } = db
const helpers = require('../_helpers')

const tweetService = {
  getTweets: (req, res, callback) => {
    return Tweet.findAll({
      include: [User, Reply, { model: User, as: 'LikedUsers' }],
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
      callback({ tweets })
    })
  },
  postTweet: (req, res, callback) => {
    const description = req.body.description
    if (!description.trim()) {
      return callback({ status: 'error', message: '貼文不可空白' })
    } else if (description.length > 140) {
      return callback({ status: 'error', message: '貼文不得超過 140 個字' })
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
    })
      .then((tweet) => {
        callback({
          tweet: tweet.toJSON(),
          isLiked: tweet.LikedUsers.map((d) => d.id).includes(
            helpers.getUser(req).id
          )
        })
      })
      .catch((err) => console.log(err))
  }
}

module.exports = tweetService
