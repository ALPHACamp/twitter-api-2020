const { Reply, Tweet, User } = require('../models')
const { getUser } = require('../helpers/auth-helpers')

const tweetController = {
  postTweet: (req, res, next) => {
    const { description } = req.body
    if (!getUser(req)) throw new Error('user不存在')
    if (!description.trim()) throw new Error('推文不能為空白')
    if (description.length > 140) throw new Error('推文字數限制在 140 以內')
    Tweet.create({
      userId: getUser(req).id,
      description
    })
      .then(tweet => res.status(200).json({ status: 'success', tweet }))
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: { model: User },
      raw: true,
      nest: true
    })

      .then(tweets => res.status(200).json({ status: 'success', tweets }))
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    Tweet.findByPk(req.params.id, {
      include: [
        { model: User },
        {
          model: Reply,
          order: [['createdAt', 'DESC']]
        }
      ],
      raw: true,
      nest: true
    })
      .then(tweet => {
        if (!tweet) throw new Error('推文不存在')
        res.json({ status: 'success', tweet })
      })
      .catch(err => next(err))
  },
  postReply: (req, res, next) => {
    const { comment } = req.body
    if (!comment.trim()) throw new Error('回覆內容不能空白')
    Tweet.findByPk(req.params.tweet_id, {
      include: { model: User }
    })
      .then(tweet => {
        if (!tweet) throw new Error('推文不存在')
        return Reply.create({
          userId: getUser(req).id,
          tweetId: tweet.id,
          comment
        })
      })
      .then(reply => res.status(200).json({ status: 'success', reply }))
      .catch(err => next(err))
  },
  getReply: (req, res, next) => {
    Tweet.findByPk(req.params.tweet_id)
      .then(tweet => {
        if (!tweet) throw new Error('推文不存在')
        return Reply.findAll(
          { where: { tweetId: tweet.id } }
        )
      })
      .then(replies => {
        const data = []
        replies.forEach(reply => data.push(reply))
        res.status(200).json(data)
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
