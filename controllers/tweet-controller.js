const { Tweet, User, Reply, Like } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  // GET /tweets - 所有推文，包括推文作者
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [{
        model: User,
        attributes: [
          'id', 'account', 'name', 'avatar'
        ]
      }, {
        model: Reply,
        attributes: ['id']
      }, {
        model: Like,
        attributes: ['id']
      }]
    })
      .then(tweets => {
        // const a = tweets.get({ plain: true })
        // console.log(a)
        res.json(tweets)
      })
      .catch(err => next(err))
  },
  // GET /tweets/:tweet_id - 一筆推文
  getTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: [
          'id', 'account', 'name', 'avatar'
        ]
      }
    })
      .then(tweet => {
        if (!tweet) throw new Error('此推文不存在')
        res.json(tweet)
      })
      .catch(err => next(err))
  },
  // 新增推文 - POST /tweets
  postTweet: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const { description } = req.body

    if (!description) throw new Error('推文內容不可為空白')

    return User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error('此user不存在')
        return Tweet.create({
          UserId: user.id,
          description
        })
      })
      .then(newTweet => res.json(newTweet))
      .catch(err => next(err))
  },
  // 新增回覆 POST /tweets/:tweet_id/replies
  postTweetReplies: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const tweetId = req.params.id
    const { comment } = req.body

    if (!comment) throw new Error('回覆不可為空白')

    return Promise.all([
      User.findByPk(userId),
      Tweet.findByPk(tweetId)
    ])
      .then(([user, tweet]) => {
        if (!user) throw new Error('此user不存在')
        if (!tweet) throw new Error('此推文不存在')
        return Reply.create({
          UserId: user.id,
          TweetId: tweet.id,
          comment
        })
      })
      .then(newReply => res.json(newReply))
      .catch(err => next(err))
  },
  // 瀏覽 GET /tweets/:tweet_id/replies
  getTweetReplies: (req, res, next) => {
    const tweetId = req.params.id

    return Promise.all([
      Tweet.findByPk(tweetId),
      Reply.findAll({
        where: {
          TweetId: tweetId
        },
        include: {
          model: User,
          attributes: [
            'id', 'account', 'name', 'avatar'
          ]
        }
      })
    ])
      .then(([tweet, replies]) => {
        if (!tweet) throw new Error('無此篇推文')
        res.json(replies)
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
