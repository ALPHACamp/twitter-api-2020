const { Tweet, User, Reply, Like } = require('../models')

const tweetController = {
  postTweet: (req, res, next) => {
    const { description } = req.body
    const userId = req.user.id
    const [descriptionMin, descriptionMax] = [1, 140]
    if (description.length < descriptionMin || description.length > descriptionMax) throw new Error(`字數限制需在 ${descriptionMin} ~ ${descriptionMax} 之間`)

    User.findByPk(userId) // 查看user是否存在
      .then(user => {
        if (!user) throw new Error('使用者不存在')
        return Tweet.create({
          description,
          userId: userId
        })
      })
      .then(tweet => {
        res.json({ status: 'success', data: { tweet } })
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    Tweet.findAll({})
      .then(tweets => {
        res.json({ status: 'success', data: { tweets } })
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const tweetId = req.params.tweet_id
    Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) throw new Error('此推文不存在')
        res.json({ status: 'success', data: { tweet } })
      })
      .catch(err => next(err))
  },
  likeTweet: (req, res, next) => {
    const TweetId = Number(req.params.id)
    const UserId = req.user.id
    return Promise.all([
      Tweet.findByPk(TweetId, { raw: true }),
      Like.findOne({
        where: { UserId, TweetId }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error('推文不存在')
        if (like) throw new Error('按過喜歡了')
        return Like.create({
          UserId,
          TweetId
        })
      })
      .then(like => {
        res.json({ status: 'success', data: { like } })
      })
      .catch(err => next(err))
  },
  unlikeTweet: (req, res, next) => {
    const tweetId = Number(req.params.id)
    const userId = req.user.id
    return Promise.all([
      Tweet.findByPk(tweetId, { raw: true }),
      Like.findOne({
        attributes: ['id', 'UserId', 'TweetId', 'createdAt', 'updatedAt'],
        where: { userId, tweetId }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error('推文不存在')
        if (!like) throw new Error('沒按過')
        return like.destroy()
      })
      .then(like => {
        res.json({ status: 'success', data: { like } })
      })
  },
  postReply: (req, res, next) => {
    const tweetId = Number(req.params.tweet_id)
    const { comment } = req.body
    const userId = req.user.id
    Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) throw new Error('此貼文不存在')
        return Reply.create({
          comment,
          userId,
          tweetId
        })
      })
      .then(reply => {
        res.json({ status: 'success', data: { reply } })
      })
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    const tweetId = Number(req.params.tweet_id)
    Promise.all([
      Tweet.findByPk(tweetId),
      Reply.findAll({ where: { tweetId }, raw: true })
    ])
      .then(([tweet, replies]) => {
        if (!tweet) throw new Error('此推文不存在')
        res.json({ status: 'success', data: { replies } })
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
