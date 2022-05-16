const { Tweet, Like, User, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  addLike: (req, cb) => {
    return Promise.all([
      Tweet.findByPk(req.params.id),
      Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: req.params.id
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        if (like) throw new Error('You have Like this Tweet')

        return Like.create({
          UserId: helpers.getUser(req).id,
          TweetId: req.params.id
        })
      })
      .then(addlike => cb(null, addlike))
      .catch(err => cb(err))
  },
  removeLike: (req, cb) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't like this tweet")

        return like.destroy()
      })
      .then(removelike => cb(null, removelike))
      .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    const { description } = req.body
    const UserId = helpers.getUser(req).id
    if (!description) throw new Error('tweet description is required!')
    return User.findByPk(UserId)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return Tweet.create({
          description,
          UserId
        })
      })
      .then(newtweet => cb(null, newtweet))
      .catch(err => cb(err))
  },
  getTweets: (req, cb) => {
    return Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [Like, Reply]
    })
      .then(tweet => {
        const likeCount = tweet.map(r => ({
          ...r.toJSON(),
          Likes: r.Likes.length ? r.Likes.length : 0,
          Replies: r.Replies.length ? r.Replies.length : 0
        }))
        return cb(null, likeCount)
      })
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    return Tweet.findByPk(req.params.tweet_id, {
      include: [
        Like,
        Reply
      ]
    })
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        const tweetData = tweet.toJSON()
        tweetData.Likes = tweetData.Likes.length ? tweetData.Likes.length : 0
        tweetData.Replies = tweetData.Replies.length ? tweetData.Replies.length : 0
        return cb(null,  tweetData )
        })
        .catch(err => cb(err))
  },
  addReply: (req, cb) => {
    const comment = req.body.comment.trim()
    if (!comment) throw new Error("Please enter you reply!")
    return Tweet.findByPk(req.params.tweet_id, {raw: true})
      .then(tweet => {
        if(!tweet) throw new Error("Tweet didn't exist!")
        return Reply.create({
          UserId: helpers.getUser(req).id,
          TweetId: req.params.tweet_id,
          comment
        })
      })
      .then(addedReply => cb(null, addedReply))
      .catch(err => cb(err))
  },
  viewReplies: (req, cb) => {
    return Promise.all([
      Tweet.findByPk(req.params.tweet_id),
      Reply.findAll({
        where: { TweetId: req.params.tweet_id},
        include: [{model: Tweet, include: User}, {model: User}],
        order: [['createdAt', 'DESC']]
      })
    ])
    .then(([tweet, replies]) => {
      if (!tweet) throw new Error("Tweet didn't exist!")
      const repliesData = replies.map(r => ({
        ...r.toJSON(),
        userName: r.User.name,
        userAvatar: r.User.avatar,
        replyUserId: r.Tweet.User.id,
        replyUserAccount: r.Tweet.User.account,
        replyUserName: r.Tweet.User.name,
        User,
        Tweet
      }))

      return cb(null, repliesData)
    })
    .catch(err => cb(err))
  }
}

module.exports = tweetController