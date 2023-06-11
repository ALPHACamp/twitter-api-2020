const { Tweet, Reply, Like, User } = require('../../models')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [
        { model: Reply },
        { model: Like }
      ],
      order: [['createdAt', 'DESC']],
    })
      .then(ts => {
        const tweets = ts.map(tweet => {
          const tweetData = tweet.toJSON()
          tweetData.RepliesCount = tweet.Replies.length
          tweetData.LikesCount = tweet.Likes.length
          return tweetData
        })
        res.status(200).json({ status: 'success', tweets })
      })
      .catch(err => {
        res.status(500).json({ status: 'error', error: err.message })
      })
  },
  getPostTweet: (req, res, next) => {
    User.findOne({ where: { id: req.user.id } })
      .then(user => {
        if (!user) throw new Error(`Not logged in`)
        const userAvatar = user.avatar
        res.status(200).json({ status: 'success', userAvatar })
      })
      .catch(err => {
        res.status(500).json({ status: 'error', error: err.message })
      })
  },
  postTweet: (req, res, next) => {
    const { description } = req.body
    return Tweet.create({
      description,
      userId: req.user.id
    })
      .then(tweet => res.status(200).json({ status: 'success', tweet }))
      .catch(err => {
        res.status(500).json({ statue: 'err', error: err.message })
      })
  }
}

module.exports = tweetController

