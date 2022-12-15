const { User, Tweet, Reply, Like } = require('./../models')
const helpers = require('../_helpers')
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
    const userId = req.user.id
    User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return Tweet.create({
          description
        })
      })
      .then(postedTweet => cb(null, { status: 'success', postedTweet }))
      .catch(err => cb(err))
  },
  postReply: (req, cb) => {
    const { comment } = req.body
    const tweetId = req.params.tweetId
    const userId = req.user.id
    Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return Reply.create({
          userId,
          tweetId,
          comment
        })
      })
      .then(postedReply => cb(null, { status: 'success', postedReply }))
      .catch(err => cb(err))
  },
  getReplies: (req, cb) => {
    const tweetId = req.params.tweetId
    Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return Reply.findAll({ where: { tweetId }, include: [User], nest: true })
      })
      .then(replies => cb(null, replies))
      .catch(err => cb(err))
  },
  likeTweet: (req, cb) => {
    const userId = req.user.id
    const tweetId = req.params.tweetId
    return Promise.all([
      User.findByPk(userId),
      Like.findOne({
        where: {
          userId,
          tweetId
        }
      })
    ])
      .then(([user, like]) => {
        if (!user) throw new Error("User didn't exist!")
        if (like) throw new Error('Tweet has already been liked!')
        return Like.create({
          tweetId,
          userId
        })
      })
      .then(result => {
        cb(null, { status: 'success', result })
      })
      .catch(err => cb(err))
  },
  unlikeTweet: (req, cb) => {
    const userId = helpers.getUser(req).id
    const tweetId = req.params.tweetId
    Like.findOne({
      where: {
        userId,
        tweetId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this tweet!")
        return like.destroy()
      })
      .then(deletedLike => cb(null, { status: 'success', deletedLike }))
      .catch(err => cb(err))
  }
}
module.exports = tweetServices
