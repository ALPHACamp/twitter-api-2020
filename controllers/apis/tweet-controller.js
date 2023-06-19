const { Tweet, Reply, Like, User } = require('../../models')
const helpers = require('../../_helpers')

const tweetController = {
  getTweets: (req, res) => {

    return Tweet.findAll({
      include: [
        { model: User, attributes: ['name', 'account'] },
        { model: Like, attributes: ['UserId'] },
        { model: Reply, attributes: ['id'] }
      ],
      order: [['createdAt', 'DESC']]
    })
      // return Tweet.findAll({
      //   include: [
      //     { model: User, attributes: ['name', 'account'] },
      //     { model: Reply, attributes: ['name', 'account'] },
      //     { model: Like }
      //   ],
      //   order: [['createdAt', 'DESC']]
      // })
      .then(ts => {
        if (!ts) throw new Error('Tweets is not exist')
        const tweetData = ts.map(tweet => {
          const tweetMapData = tweet.toJSON()
          return {
            ...tweetMapData,
            RepliesCount: tweet.Replies.length,
            LikesCount: tweet.Likes.length,
            isLiked: tweet.Likes.some(like => like.UserId === helpers.getUser(req).id)
          }
        })
        res.status(200).json(tweetData)
      })
      .catch(err => {
        res.status(500).json({ status: 'error', error: err.message })
      })
  },
  getPostTweet: (req, res) => {
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
  postTweet: (req, res) => {
    const { description } = req.body
    new Promise((resolve, reject) => {
      if (Number(description.length) > 140) reject(new Error('The character count cannot exceed 140.'))
      if (Number(description.length) < 1) reject(new Error('Content cannot be blank.'))
      resolve()
    })
      .then(() => {
        return Tweet.create({
          description: description,
          UserId: helpers.getUser(req).id
        })
      })
      .then(tweet => res.status(200).json(tweet))
      .catch(err => res.status(500).json({ status: 'err', error: err.message }))
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
  getReplies: (req, res) => {
    // const userId = helpers.getUser(req).id
    const tweetId = req.params.tweet_id
    return Tweet.findByPk(tweetId, {
      include:
        [{ model: Reply, include: [{ model: User }] }]
    })
      .then(tweet => {
        if (!tweet) throw new Error('Tweet is no exist')
        res.status(200).json(tweet.Replies)
      })
      .catch(err => {
        res.status(500).json({ statue: 'err', error: err.message })
      })
  },
  postReply: (req, res) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.tweet_id
    const { comment } = req.body
    new Promise((resolve, reject) => {
      if (Number(req.body.comment.length) < 1) reject(new Error('Content cannot be blank.'))
      resolve()
    })
      .then(() => {
        return Promise.all([
          Tweet.findByPk(TweetId),
          User.findByPk(UserId)
        ])
      })
      .then(([tweet, user]) => {
        if (!tweet) throw new Error('The tweet does not exist.')
        if (!user) throw new Error(`Please log in again.`)
        return Reply.create({
          comment,
          UserId,
          TweetId
        })
      })
      .then(reply => res.status(200).json(reply))
      .catch(err => res.status(500).json({ status: 'err', error: err.message }))
  },
  getTweet: (req, res) => {
    const tweetId = req.params.tweet_id
    return Promise.all([
      Tweet.findByPk(tweetId, {
        include: [
          { model: User, attributes: { exclude: ['password'] } },
          { model: Like }
        ]
      }),
      Reply.count({ where: { TweetId: tweetId } }),
    ])
      .then(([tweet, replies]) => {
        if (!tweet) throw new Error('The tweet does not exist.')
        tweet = tweet.toJSON()
        tweet.tweetOwnerName = tweet.User.name
        tweet.tweetOwnerAccount = tweet.User.account
        tweet.tweetOwnerAvatar = tweet.User.avatar
        delete tweet.User
        tweet.tweetLikeCount = tweet.Likes.length
        tweet.tweetReplyCount = replies
        tweet.isLiked = tweet.Likes.some(like => like.UserId === helpers.getUser(req).id)
        delete tweet.Likes
        res.status(200).json(tweet)
      })
      .catch(err => {
        res.status(500).json({ status: 'err', error: err.message })
      })
  }
}

module.exports = tweetController
