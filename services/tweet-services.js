const { User, Tweet, Reply, Like } = require('./../models')
const tweetServices = {
  getTweets: (req, cb) => {
    return Tweet.findAll({
      include: [User]
    })
      .then(tweets => cb(null, tweets))
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    const { tweetId } = req.params
    return Tweet.findByPk(tweetId, {
      include: [User]
    })
      .then(tweet => cb(null, tweet))
      .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    const description = req.body.description
    const id = req.user.id
    console.log(req.body)
    User.findByPk(id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return Tweet.create({
          userId,
          description
        })
      })
      .then(postedTweet => cb(null, { status: 'success', postedTweet }))
      .catch(err => cb(err))
  }
}
module.exports = tweetServices
