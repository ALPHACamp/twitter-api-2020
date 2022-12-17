const { Tweet, User, Reply, Like, sequelize } = require('../models')
const helpers = require('../_helpers')
const { dateFormat } = require('../helpers/date-helper')

const tweetController = {
  // 新增推文：
  postTweet: (req, res, next) => {
    const { description } = req.body
    if (!description) throw new Error('推文欄位必填!')
    if (!description?.trim()) throw new Error('內容不可空白!')
    if (description?.length > 140) throw new Error('推文字數限制在 140 以內!')
    return Tweet.create({
      UserId: helpers.getUser(req).id,
      description
    })
      .then(newTweet =>
        res.json(newTweet)
      )
      .catch(err => next(err))
  },
  // 取得所有推文：
  getTweets: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return Tweet.findAll({
      include: [
        {
          model: User,
          attributes: {
            exclude: ['password']
          }
        }],
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM replies WHERE replies.TweetId = tweet.id )'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM likes WHERE likes.TweetId = tweet.id )'), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM likes WHERE likes.UserId = ${currentUser.id} AND likes.TweetId = tweet.id )`), 'isLiked']
        ]
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        return tweets.map(tweet => ({
          ...tweet,
          relativeTime: dateFormat(tweet.createdAt).fromNow()// [ 修 ]：發文過一週？是的話顯示日期，不是的話顯示多久之前
        }))
      })
      .then(tweets =>
        res.json(tweets)
      )
      .catch(err => next(err))
  },
  // 取得一則推文：
  getTweet: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return Tweet.findByPk(req.params.tweet_id, {
      include: [
        {
          model: User,
          attributes: {
            exclude: ['password']
          }
        }],
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM replies WHERE replies.TweetId = tweet.id )'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM likes WHERE likes.TweetId = tweet.id )'), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM likes WHERE likes.UserId = ${currentUser.id} AND likes.TweetId = tweet.id )`), 'isLiked']
        ]
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweet => {
        if (!tweet) {
          const err = new Error("Tweet didn't exist!")
          err.status = 404
          throw err
        }
        const tweetAddTime = {
          ...tweet,
          exactTime: dateFormat(tweet.createdAt).format('A hh:mm YYYY年 MMM DD日'),
          relativeTime: dateFormat(tweet.createdAt).fromNow()
        }
        return res.json(tweetAddTime)
      })
      .catch(err => next(err))
  },
  // 將推文加入喜歡
  addLike: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    const TweetId = req.params.id
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: {
          UserId: currentUser.id,
          TweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        const likeJson = like.toJSON()
        if (likeJson.UserId === currentUser.id) throw new Error('不能按自己的推文讚!')
        if (like) throw new Error('You have liked this tweet!')
        return Like.create({
          UserId: currentUser.id,
          TweetId
        })
      })
      .then(newLike =>
        res.json(newLike)
      )
      .catch(err => next(err))
  },
  // 將推文移除喜歡
  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this tweet")

        return like.destroy()
      })
      .then(newUnlike => res.json(newUnlike))
      .catch(err => next(err))
  }
}

module.exports = tweetController
