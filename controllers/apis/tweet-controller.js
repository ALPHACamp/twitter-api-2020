const { Tweet, Reply, Like, User } = require('../../models')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [
        { model: User },
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
        if (!user) throw new Error('Not logged in')
        const userAvatar = user.avatar
        res.status(200).json({ status: 'success', userAvatar })
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
      description,
      userId: req.user.id
    })
      .then(tweet => res.status(200).json({ status: 'success', tweet }))
      .catch(err => {
        res.status(500).json({ statue: 'err', error: err.message })
      })
  },
  getReply: (req, res, next) => {
    const userId = req.user.id
    const { tweetId } = req.params
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
        res.status(200).json({ statue: 'success', tweet })
      })
      .catch(err => {
        res.status(500).json({ statue: 'err', error: err.message })
      })
  },
  postReply: (req, res, next) => {
    const userId = req.user.id
    const { tweetId } = req.params
    const { comment } = req.body
    if (Number(comment.length) < 1) throw new Error('Content cannot be blank.')
    Promise.all([
      Tweet.findByPk(tweetId),
      User.findByPk(userId)
    ])
      .then(([tweet, user]) => {
        if (!tweet) throw new Error('The tweet does not exist.')
        if (!user) throw new Error(`Please log in again.`)
        return Reply.create({
          comment,
          userId,
          tweetId
        })
      })
      .then(reply => {
        res.status(200).json({ statue: 'success', reply })
      })
      .catch(err => {
        res.status(500).json({ statue: 'err', error: err.message })
      })
  }
}

module.exports = tweetController
