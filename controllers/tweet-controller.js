const { Tweet, User, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweet: (req, res, next) => {
    const likedTweetsId = helpers.getUser(req)?.Likes ? helpers.getUser(req).Likes.map(l => l.TweetId) : []
    Tweet.findByPk(req.params.tweet_id, {
      include: [User, Like, Reply],
      nest: true
    })
      .then(tweet => {
        if (!tweet) {
          const err = new Error('推文不存在！')
          err.status = 404
          throw err
        }
        tweet = tweet.toJSON()
        tweet.likesCount = tweet.Likes.length
        tweet.repliesCount = tweet.Replies.length
        tweet.isLiked = likedTweetsId.includes(tweet.id)
        delete tweet.Likes
        delete tweet.Replies
        delete tweet.User.password
        return res.json(tweet)
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    const likedTweetsId = helpers.getUser(req)?.Likes ? helpers.getUser(req).Likes.map(l => l.TweetId) : []
    Tweet.findAll({
      include: [
        { model: User, attributes: { exclude: 'password' } },
        Like,
        Reply
      ],
      order: [['createdAt', 'DESC']],
      nest: true
    })
      .then(tweets => {
        const data = tweets.map(tweet => {
          tweet = tweet.toJSON()
          tweet.likesCount = tweet.Likes.length
          tweet.repliesCount = tweet.Replies.length
          tweet.isLiked = likedTweetsId.includes(tweet.id)
          delete tweet.Likes
          delete tweet.Replies
          return tweet
        })
        return res.json(data)
      })
      .catch(err => next(err))
  },
  postTweet: async (req, res, next) => {
    const { description } = req.body
    if (!description) throw new Error('所有欄位都是必填！')
    if (description.length > 140) throw new Error('推文字數超過上限。')
    try {
      const newTweet = await Tweet.create({
        UserId: helpers.getUser(req).id,
        description
      })
      return res.json({ status: 'success', data: { tweet: newTweet } })
    } catch (err) {
      return next(err)
    }
  },
  getTweetReplies: (req, res, next) => {
    Promise.all([
      Tweet.findByPk(req.params.tweet_id),
      Reply.findAll({
        where: { TweetId: req.params.tweet_id },
        include: { model: User, attributes: { exclude: 'password' } },
        order: [['createdAt', 'DESC']],
        nest: true
      })
    ])
      .then(([tweet, replies]) => {
        if (!tweet) {
          const err = new Error('推文不存在！')
          err.status = 404
          throw err
        }
        return res.json(replies)
      })
      .catch(err => next(err))
  },
  postTweetReply: (req, res, next) => {
    const { comment } = req.body
    if (!comment) throw new Error('所有欄位都是必填！')
    if (comment.length > 140) throw new Error('留言字數超過上限。')
    Tweet.findByPk(req.params.tweet_id)
      .then(tweet => {
        if (!tweet) {
          const err = new Error('推文不存在！')
          err.status = 404
          throw err
        }
        return Reply.create({
          UserId: helpers.getUser(req).id,
          TweetId: req.params.tweet_id,
          comment
        })
      })
      .then(newReply => res.json({ status: 'success', data: { reply: newReply } }))
      .catch(err => next(err))
  },
  likeTweet: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.id
    Promise.all([
      Like.findOne({ where: { TweetId, UserId } }),
      Tweet.findByPk(TweetId)
    ])
      .then(([like, tweet]) => {
        if (!tweet) {
          const err = new Error('推文不存在！')
          err.status = 404
          throw err
        }
        if (like) throw new Error('已經按過讚了！')
        return Like.create({ UserId, TweetId })
      })
      .then(newLike => res.json({ status: 'success', data: { like: newLike } }))
      .catch(err => next(err))
  },
  unlikeTweet: (req, res, next) => {
    const TweetId = req.params.id
    const UserId = helpers.getUser(req).id
    Promise.all([
      Like.findOne({ where: { TweetId, UserId } }),
      Tweet.findByPk(TweetId)
    ])
      .then(([like, tweet]) => {
        if (!tweet) {
          const err = new Error('推文不存在！')
          err.status = 404
          throw err
        }
        if (!like) throw new Error('你還沒讚過這則推文！')
        return like.destroy()
      })
      .then(deletedLike => res.json({ status: 'success', data: { like: deletedLike } }))
      .catch(err => next(err))
  }
}

module.exports = tweetController
