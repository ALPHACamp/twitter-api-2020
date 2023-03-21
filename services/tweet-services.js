const { Tweet, Reply, Like } = require('../models')
const helpers = require('../_helpers')

const tweetServices = {
  // 推文
  getTweets: (req, cb) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
      .then(tweets => cb(null, tweets))
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    Tweet.findByPk(req.params.id, {
      include: [{
        model: Reply,
        order: [['createdAt', 'DESC']]
      }],
      order: [['createdAt', 'DESC']]
    })
      .then(tweet => cb(null, tweet))
      .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    const { description } = req.body
    if (!description || description.trim().length === 0) throw new Error('內容不可空白')
    if (description.length > 140) throw new Error('字數超過140')
    Tweet.create({
      description,
      UserId: helpers.getUser(req) ? helpers.getUser(req).id : req.user.id
    }
    )
      .then(newtweet => cb(null, newtweet))
      .catch(err => cb(err))
  },
  // 回覆
  getReplies: (req, cb) => {
    Reply.findAll({
      where: { TweetId: req.params.id },
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
      .then(replies => cb(null, replies))
      .catch(err => cb(err))
  },
  postReply: (req, cb) => {
    const { comment } = req.body
    if (comment.trim().length === 0) throw new Error('內容不可空白')
    Reply.create({
      comment,
      UserId: helpers.getUser(req) ? helpers.getUser(req).id : req.user.id,
      TweetId: req.params.id
    })
      .then(reply => cb(null, reply))
      .catch(err => cb(err))
  },
  // 喜歡與取消喜歡推文
  postLike: (req, cb) => {
    Like.findOne({
      where: {
        UserId: helpers.getUser(req) ? helpers.getUser(req).id : req.user.id,
        TweetId: req.params.id
      }
    }).then(like => {
      if (!like) {
        return Like.create({
          UserId: helpers.getUser(req) ? helpers.getUser(req).id : req.user.id,
          TweetId: req.params.id
        })
      } else return like
    })
      .then(like => cb(null, like))
      .catch(err => cb(err))
  },
  postUnLike: (req, cb) => {
    Like.findOne({
      where: {
        UserId: helpers.getUser(req) ? helpers.getUser(req).id : req.user.id,
        TweetId: req.params.id
      }
    }).then(like => {
      if (!like) throw new Error('目前沒有喜歡這則推文')
      return like.destroy()
    })
      .then(deletedLike => cb(null, deletedLike))
      .catch(err => cb(err))
  }
}
module.exports = tweetServices
