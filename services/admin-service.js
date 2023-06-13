const { Tweet, User, Reply } = require('../models')


const adminServices = {
  getTweets: (req, cb) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User]
    }).then(tweet => cb(null, { tweet })
    ).catch(err=>cb(err))
  },
  getTweet:(req, cb) => {
    return Tweet.findByPk(req.params.id, { include: [Reply] }).then(tweet => {
      if (!tweet) {
        const err = new Error("The tweet didn't exist!")
          err.status = 404
          throw err
      }
      return tweet
    }).then(tweet => cb(null, { tweet }))
      .catch(err => cb(err))
  },
  deleteTweet:(req, res, next) => {
    return Tweet.findByPk(req.params.id)
    .then(tweet => {
      if (!tweet) throw new Error("The tweet didn't exist!")
      Promise.all(
          Reply.destroy({ where: { TweetId: req.params.id } }),
          Like.destroy({ where: { TweetId: req.params.id } })
      )
      const deletedTweet = tweet.toJSON()
      return tweet.destroy().then(() => {
        return res.status(200).json({ status: 'success', message: 'Tweet deleted', deletedTweet})
      })
    })
    .catch(err => next(err))
  }
}

module.exports = adminServices