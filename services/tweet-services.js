const sequelize = require('sequelize')
const { User, Tweet, Reply, Like } = require('./../models')
const helpers = require('../_helpers')
const tweetServices = {
  getTweets: (req, cb) => {
    return Tweet.findAll({
      // attributes: [
      //   'id', 'UserId', 'description', 'createdAt', 'updatedAt'
      //   [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE tweet_id = id)'), 'replyCount'],
      //   [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE tweet_id = id)'), 'likedCount']
      // ],

      include: [{
        model: User,
        attributes: [
          'id', 'avatar', 'name', 'account'
        ]
      }],
      order: [['id', 'DESC']]
    })
      .then(datas => {
        const tweets = datas.map(data => ({
          ...data.toJSON(),
          isLiked: helpers.getUser(req).LikedTweets.some(t => t.TweetId === data.id)
        }))
        cb(null, tweets)
      })
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    const { tweetId } = req.params
    return Tweet.findByPk(tweetId, {
      include: [{ model: User }],
      raw: true,
      nest: true
    })
      .then(tweet => {
        delete tweet.User.password
        cb(null, tweet)
      })
      .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    const description = req.body.description
    const UserId = helpers.getUser(req).id
    return User.findByPk(UserId)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return Tweet.create({
          description,
          UserId
        })
      })
      .then(postedTweet => cb(null, postedTweet))
      .catch(err => cb(err))
  },
  postReply: (req, cb) => {
    const { comment } = req.body
    const TweetId = req.params.tweetId
    const UserId = helpers.getUser(req).id
    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return Reply.create({
          UserId,
          TweetId,
          comment
        })
      })
      .then(postedReply => cb(null, { status: 'success', postedReply }))
      .catch(err => cb(err))
  },
  getReplies: (req, cb) => {
    const TweetId = req.params.tweetId
    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return Reply.findAll({
          where: { TweetId },
          include: [{ model: User }],
          raw: true,
          nest: true
        })
      })
      .then(replies => {
        replies.forEach(r => delete r.User.password)
        cb(null, replies)
      })
      .catch(err => cb(err))
  },
  likeTweet: (req, cb) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.tweetId
    return Promise.all([
      User.findByPk(UserId),
      Like.findOne({
        where: {
          UserId,
          TweetId
        }
      })
    ])
      .then(([user, like]) => {
        if (!user) throw new Error("User didn't exist!")
        if (like) throw new Error('Tweet has already been liked!')
        return Like.create({
          TweetId,
          UserId
        })
      })
      .then(result => {
        cb(null, { status: 'success', result })
      })
      .catch(err => cb(err))
  },
  unlikeTweet: (req, cb) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.tweetId
    return Like.findOne({
      where: {
        UserId,
        TweetId
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
