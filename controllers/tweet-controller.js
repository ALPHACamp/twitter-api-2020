const { Like, Reply, Tweet, User } = require('../models')
const { getUser } = require('../_helpers')

const tweetController = {
  // 新增推文
  postTweet: (req, res, next) => {
    const { description } = req.body
    User.findByPk(getUser(req).dataValues.id)
      .then(user => {
        if (!user) throw new Error('Can not find this user.')
        return Tweet.create({
          UserId: user.id,
          description
        })
      })
      .then(tweet => {
        return res.status(200).json({ success: true, tweet })
      })
      .catch(err => next(err))
  },
  // 取得所有推文
  getTweets: (req, res, next) => {
    const currentUser = getUser(req)
    return Tweet.findAll({
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
        { model: Reply },
        { model: Like }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const data = tweets.map(t => {
          t = t.toJSON()
          if (currentUser.Likes) {
            t.currentUserLikes = currentUser.Likes.some(l => l.TweetId === t.id)
            t.replyCounts = t.Replies.length
            t.likeCounts = t.Likes.length
          }
          delete t.Replies
          delete t.Likes
          return t
        })
        return res.status(200).json(data)
      })
      .catch(err => next(err))
  },
  // 取得單一推文
  getTweet: (req, res, next) => {
    const currentUser = getUser(req)
    return Tweet.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'avatar', 'name', 'account'] },
        { model: Reply, include: { model: User, attributes: ['id', 'avatar', 'name', 'account'] } },
        { model: Like, attributes: ['id'] }
      ],
      order: [
        [{ model: Reply }, 'createdAt', 'DESC']
      ]
    })
      .then(tweet => {
        if (!tweet) throw new Error('推文不存在')
        tweet = tweet.toJSON()
        if (currentUser.Likes) {
          tweet.currentUserLikes = currentUser.Likes.some(l => l.TweetId === tweet.id)
          tweet.replyCounts = tweet.Replies.length
          tweet.likeCounts = tweet.Likes.length
        }
        delete tweet.Likes
        return res.status(200).json(tweet)
      })
      .catch(err => next(err))
  },
  // 新增回覆
  postReply: (req, res, next) => {
    const { comment } = req.body
    if (!comment.trim()) return res.status(400).json({ message: '回覆內容不能空白' })
    Tweet.findByPk(req.params.tweet_id, {
      include: { model: User }
    })
      .then(tweet => {
        if (!tweet) throw new Error('推文不存在')
        return Reply.create({
          UserId: getUser(req).dataValues.id,
          TweetId: tweet.id,
          comment
        })
      })
      .then(reply => {
        return res.status(200).json({ success: true, reply })
      })
      .catch(err => next(err))
  },
  // 取得某推文的回覆
  getReply: (req, res, next) => {
    return Tweet.findByPk(req.params.tweet_id)
      .then(tweet => {
        if (!tweet) throw new Error('推文不存在')
        return Reply.findAll(
          { where: { TweetId: tweet.id } }
        )
      })
      .then(replies => {
        const data = []
        replies.forEach(reply => data.push(reply))
        return res.status(200).json(data)
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
