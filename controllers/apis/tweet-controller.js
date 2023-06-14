const { Tweet, Reply, Like, User } = require('../../models')
const helpers = require('../../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [
        { model: User },
        { model: Reply },
        { model: Like }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(ts => {
        const tweetData = ts.map(tweet => {
          const tweetMapData = tweet.toJSON()
          delete tweetMapData.User.password
          return {
            ...tweetMapData,
            RepliesCount: tweet.Replies.length,
            LikesCount: tweet.Likes.length
          }
        })
        res.status(200).json(tweetData)
      })
      .catch(err => {
        res.status(500).json({ status: 'error', error: err.message })
      })
  },
  getPostTweet: (req, res, next) => {
    User.findOne({ where: { id: helpers.getUser(req).id } })
      .then(user => {
        if (!user) throw new Error('Not logged in')
        const userAvatar = user.avatar
        res.status(200).json(userAvatar)
      })
      .catch(err => {
        res.status(500).json({ status: 'error', error: err.message })
      })
  },
  postTweet: (req, res, next) => {
    const { description } = req.body
    if (Number(description.length) > 140) throw new Error('The character count cannot exceed 140.')
    if (Number(description.length) < 1) throw new Error('Content cannot be blank.')
    return Tweet.create({
      description: description,
      UserId: helpers.getUser(req).id
    })
      .then(tweet => res.status(200).json(tweet))
      .catch(err => {
        res.status(500).json({ statue: 'err', error: err.message })
      })
  },
  getReply: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const tweetId = req.params.tweet_id
    Promise.all([
      User.findByPk(userId),
      Tweet.findByPk(tweetId, {
        include: [{
          model: User
        }]
      })
    ])
      .then(([user, tweet]) => {
        if (!user) throw new Error('Account is not exist!')
        const tweetData = tweet.toJSON()
        delete tweetData.User.password
        loginUser = user.toJSON()
        delete loginUser.password
        res.status(200).json(loginUser)
      })
      .catch(err => {
        res.status(500).json({ statue: 'err', error: err.message })
      })
  },
  getReplies: (req, res, next) => {
    // const userId = helpers.getUser(req).id
    const tweetId = req.params.tweet_id
    return Tweet.findByPk(tweetId, {
      include:
        [{ model: Reply, include: [{ model: User }] }]
    })
      .then(tweet => {
        res.status(200).json(tweet.Replies)
      })
      .catch(err => {
        res.status(500).json({ statue: 'err', error: err.message })
      })
  },
  postReply: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.tweet_id
    const { comment } = req.body
    if (Number(comment.length) < 1) throw new Error('Content cannot be blank.')
    Promise.all([
      Tweet.findByPk(TweetId),
      User.findByPk(UserId)
    ])
      .then(([tweet, user]) => {
        if (!tweet) throw new Error('The tweet does not exist.')
        if (!user) throw new Error(`Please log in again.`)
        return Reply.create({
          comment,
          UserId,
          TweetId
        })
      })
      .then(reply => {
        res.status(200).json(reply)
      })
      .catch(err => {
        res.status(500).json({ statue: 'err', error: err.message })
      })
  },
  getTweet: (req, res, next) => {
    const tweetId = req.params.tweet_id
    return Tweet.findByPk(tweetId, {
      include: [
        { model: User },
        { model: Like },
        {
          model: Reply,
          include: [{ model: User }],
          order: [['createdAt', 'DESC']]
        },
      ]
    })
      .then(tweet => {
        if (!tweet) throw new Error('The tweet does not exist.')
        const tweetData = tweet.toJSON()
        delete tweetData.User.password
        tweetData.Replies.forEach(reply => {
          delete reply.User.password
        })
        tweetData.replyCount = tweetData.Replies.length
        tweetData.LikesCount = tweetData.Likes.length
        res.status(200).json(tweetData)
      })
      .catch(err => {
        res.status(500).json({ statue: 'err', error: err.message })
      })
  }
}

module.exports = tweetController
