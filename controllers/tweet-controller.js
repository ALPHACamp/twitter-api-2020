const { Tweet, User, Reply, Like } = require('../models')
const helpers = require('../_helpers')

// 為配合資料表外鍵設計，所以統一命名為 userId -> UserId, tweetId -> TweetId

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [User, Reply, Like],
      order: [['createdAt', 'DESC']]
    })
      .then(tweetsData => {
        const tweets = tweetsData.map(tweet => ({
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          updatedAt: tweet.updatedAt,
          replyNum: tweet.Replies.length,
          likeNum: tweet.Likes.length,
          isLiked: tweet.Likes.some(like => like.UserId === req.user.id),
          user: {
            name: tweet.User.name,
            account: tweet.User.account,
            image: tweet.User.image
          }
        }))
        return res.status(200).json(tweets)
      })
      .catch(error => next(error))
  },
  postTweet: (req, res, next) => {
    const { description } = req.body
    const UserId = helpers.getUser(req).id
    if (!description.trim()) throw new Error('內容不可空白')
    if (description.length > 140) throw new Error('推文的字數超過上限 140 個字!')
    return User.findByPk(UserId)
      .then(user => {
        if (!user) throw new Error('使用者不存在')
        return Tweet.create({
          UserId,
          description
        })
      })
      .then(newTweet => {
        newTweet = newTweet.toJSON()
        res.status(200).json(newTweet)
      })
      .catch(error => next(error))
  },
  getTweet: (req, res, next) => {
    const TweetId = req.params.id
    return Tweet.findByPk(TweetId, { include: [User, Like, Reply] })
      .then(tweetData => {
        if (!tweetData) throw new Error('推文不存在')
        const tweet = {
          id: tweetData.id,
          UserId: tweetData.UserId,
          description: tweetData.description,
          createdAt: tweetData.createdAt,
          updatedAt: tweetData.updatedAt,
          replyNum: tweetData.Replies.length,
          likeNum: tweetData.Likes.length,
          isLiked: tweetData.Likes.some(like => like.UserId === req.user.id),
          user: {
            name: tweetData.User.name,
            account: tweetData.User.account,
            image: tweetData.User.image
          }
        }
        return res.status(200).json(tweet)
      })
      .catch(error => next(error))
  },
  postRepliedTweet: (req, res, next) => {
    const { comment } = req.body
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.tweet_id
    if (!comment.trim()) throw new Error('內容不可空白')
    return Promise.all([
      User.findByPk(UserId),
      Tweet.findByPk(TweetId)
    ])
      .then(([user, tweet]) => {
        if (!user) throw new Error('使用者不存在')
        if (!tweet) throw new Error('推文不存在')
        return Reply.create({
          comment,
          UserId,
          TweetId
        })
      })
      .then(repliedTweet => {
        repliedTweet = repliedTweet.toJSON()
        return res.status(200).json(repliedTweet)
      })
      .catch(error => next(error))
  },
  getRepliedTweet: (req, res, next) => {
    const TweetId = req.params.tweet_id
    return Promise.all([
      Tweet.findByPk(TweetId),
      Reply.findAll({
        where: { TweetId },
        include: [User],
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([tweet, replies]) => {
        if (!tweet) throw new Error('推文不存在')
        const repliedTweets = replies.map(reply => ({
          id: reply.id,
          comment: reply.comment,
          UserId: reply.UserId,
          TweetId: reply.TweetId,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
          user: {
            name: reply.User.name,
            account: reply.User.account,
            image: reply.User.image
          }
        }))
        return res.status(200).json(repliedTweets)
      })
      .catch(error => next(error))
  },
  likeTweet: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = Number(req.params.id)
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({ where: { UserId, TweetId } })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error('推文不存在')
        if (like) throw new Error('已經對推文表示喜歡')
        return Like.create({
          isLiked: true,
          UserId,
          TweetId
        })
      })
      .then(likedTweet => {
        return res.status(200).json({
          status: 'success',
          message: '新增喜歡成功',
          data: likedTweet
        })
      })
      .catch(error => next(error))
  },
  unlikeTweet: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.id
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({ where: { UserId, TweetId } })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error('推文不存在')
        if (!like) throw new Error('尚未對推文表示喜歡')
        return like.destroy()
      })
      .then(unlikedTweet => {
        return res.status(200).json({
          status: 'success',
          message: '取消喜歡成功',
          data: unlikedTweet
        })
      })
      .catch(error => next(error))
  }
}

module.exports = tweetController
