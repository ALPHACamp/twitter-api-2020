const { Tweet, User, Reply } = require('../models')

const tweetServices = {
  getTweets: (req, cb) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User, Reply]
    }).then(tweet => cb(null, { tweet })
    ).catch(err=>cb(err))
  },
  getTweet: (req, cb) => {
    return Tweet.findByPk(req.params.tweet_id).then(tweet => {
      if (!tweet) {
        const err = new Error("The tweet didn't exist!")
          err.status = 404
          throw err
      }
      return tweet
    }).then(tweet => cb(null, { tweet }))
      .catch(err => cb(err))
  },
  createTweet: (req, cb) => {
    const { description } = req.body
    const userId = req.user.user_id
    if (!description) throw new Error('Descrption text is required!')
    return Tweet.create({
      userId,
      description
    }).then(tweet => cb(null, { tweet })).catch(err => cb(err))
  }
}

module.exports = tweetServices