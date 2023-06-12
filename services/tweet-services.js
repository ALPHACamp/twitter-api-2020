const { User, Tweet, Reply, Like, sequelize } = require('../models')
const helpers = require('../_helpers.js')

const tweetServices = {
  getTweet: (req, cb) => {
    Tweet.findByPk(req.params.tweet_id, {
      include: [
        {
          model: User,
          attributes: {
            exclude: ['passwords']
          }
        },
        Like
      ],
      attributes: [
        'id', 'description', 'createdAt', 'updatedAt', 'UserId',
        [sequelize.literal('(SELECT COUNT (*) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likedCount']
      ]
    })
      .then(tweet => {
        if (!tweet) throw new Error('tweet not found')
        const data = {
          ...tweet.toJSON(),
          isLiked: tweet.Likes.map(like => like.UserId).includes(helpers.getUser(req).id)
        }
        delete data.Likes
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  getTweets: (req, cb) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: {
            exclude: ['passwords']
          }
        },
        Like
      ],
      attributes: [
        'id', 'description', 'createdAt', 'updatedAt', 'UserId',
        [sequelize.literal('(SELECT COUNT (*) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likedCount']
      ]
    })
      .then(tweets => {
        tweets = tweets.map(tweet => {
          tweet = {
            ...tweet.toJSON(),
            isLiked: tweet.Likes.map(like => like.UserId).includes(helpers.getUser(req).id)
          }
          delete tweet.Likes
          return tweet
        })
        return cb(null, tweets)
      })
      .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    const { description } = req.body
    if (description.length > 140) throw new Error('字數不能超過 140 字')
    if (!description.trim()) throw new Error('留言不能為空白')
    return Tweet.create({
      description,
      UserId: helpers.getUser(req).id
    })
      .then(tweet => cb(null, tweet))
      .catch(err => cb(err))
  },
  getTweetReplies: (req, cb) => {
    Promise.all([
      Reply.findAll({
        where: { TweetId: req.params.tweet_id },
        include: User
      }),
      Tweet.findByPk(req.params.tweet_id, { include: User })
    ])
      .then(([replies, tweet]) => {
        if (!tweet) throw new Error('tweet not found')
        replies = replies.map(reply => {
          reply = {
            ...reply.toJSON(),
            repliesAccount: tweet.User.account
          }
          delete reply.User.password
          return reply
        })
        return cb(null, replies)
      })
      .catch(err => cb(err))
  },
  postTweetReplies: (req, cb) => {
    const { comment } = req.body
    if (comment.length > 140) throw new Error('字數不能超過 140 字')
    if (!comment.trim()) throw new Error('留言不能為空白')
    Tweet.findByPk(req.params.tweet_id)
      .then(tweet => {
        if (!tweet) throw new Error('tweet not found')
        return Reply.create({
          comment,
          UserId: helpers.getUser(req).id,
          TweetId: req.params.tweet_id
        })
      })
      .then(newReply => cb(null, newReply))
      .catch(err => cb(err))
  },
  postTweetLike: (req, cb) => {
    return Promise.all([
      Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: req.params.id
        }
      }),
      Tweet.findByPk(req.params.id)
    ])
      .then(([like, tweet]) => {
        if (like) throw new Error('user had been liked this tweet')
        if (!tweet) throw new Error('tweet not found')
        return Like.create({
          UserId: helpers.getUser(req).id,
          TweetId: req.params.id
        })
      })
      .then(like => cb(null, like))
      .catch(err => cb(err))
  },
  postTweetUnlike: (req, cb) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    })
      .then(like => {
        if (!like) throw new Error('user haven\'t liked this tweet')
        return like.destroy()
      })
      .then(unlike => cb(null, unlike))
      .catch(err => cb(err))
  }
}

module.exports = tweetServices
