const sequelize = require('sequelize')
const helpers = require('../_helpers')
const { Tweet, User, Like, Reply } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
    const UserId = helpers.getUser(req)?.id
    return Promise.all([
      Tweet.findAll({
        attributes: [ // 指定回傳model欄位
          'id', 'description', 'createdAt',
          [
            sequelize.literal('(SELECT COUNT(*) FROM Replies AS replyCount WHERE tweet_id = Tweet.id)'), 'replyCount' // 回傳留言數
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM Likes AS likeCount WHERE tweet_id = Tweet.id)'), 'likeCount' // 回傳按讚數
          ]
        ],
        order: [['createdAt', 'DESC']], // 用建立時間先後排序
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        raw: true,
        nest: true
      }),
      Like.findAll({})
    ])
      .then(([tweets, likes]) => {
        const data = tweets.map(tweet => ({
          ...tweet,
          isLiked: likes.some(like => like.TweetId === tweet.id && UserId === like.UserId)
        }))
        res.status(200).json(data)
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const TweetId = req.params.id
    const UserId = helpers.getUser(req)?.id
    return Promise.all([
      Tweet.findByPk(TweetId, {
        attributes: ['id', 'description', 'createdAt',
          [
            sequelize.literal('(SELECT COUNT(*) FROM Replies AS replyCount WHERE tweet_id = Tweet.id)'), 'replyCount' // 回傳留言數
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM Likes AS likeCount WHERE tweet_id = Tweet.id)'), 'likeCount' // 回傳按讚數
          ]
        ],
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        nest: true,
        raw: true
      }),
      Like.findAll({ where: { TweetId }, raw: true })
    ])
      .then(([tweet, likes]) => {
        if (!tweet) {
          return res.status(404).json({
            success: false,
            message: 'Tweet not found'
          })
        }
        // console.log(likes)
        tweet.isLiked = likes.some(like => like.TweetId === tweet.id && like.UserId === UserId)
        res.status(200).json(tweet)
      })
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const UserId = helpers.getUser(req)?.id
    const { description } = req.body
    // 錯誤判斷
    // 空白內容
    if (!description) {
      return res.status(404).json({
        success: false,
        message: 'description is required!'
      })
    }
    // 超過140字
    if (description.length < 1 || description.length > 140) {
      return res.status(404).json({
        success: false,
        message: 'Tweet is limited to 140 characters'
      })
    }

    User.findByPk(UserId)
      .then(user => {
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          })
        }
        return Tweet.create({
          description,
          UserId
        })
      })
      .then(tweet => res.json({ success: true, message: 'Tweet has been added', tweet }))
      .catch(err => next(err))
  },
  likeTweet: (req, res, next) => {
    const TweetId = Number(req.params.id)
    const UserId = helpers.getUser(req)?.id
    return Promise.all([
      Tweet.findByPk((TweetId), { raw: true }),
      Like.findOne({
        where: {
          UserId,
          TweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) {
          return res.status(404).json({
            success: false,
            message: 'Tweet not found'
          })
        }
        if (like) {
          return res.status(400).json({
            success: false,
            message: 'Already liked'
          })
        }
        return Like.create({
          UserId,
          TweetId
        })
      })
      .then(() => res.status(200).json({ success: true, message: 'Liked successfully' }))
      .catch(err => next(err))
  },
  unlikeTweet: (req, res, next) => {
    const TweetId = Number(req.params.id)
    const UserId = helpers.getUser(req)?.id
    return Like.findOne({
      where: {
        UserId,
        TweetId
      }
    })
      .then(like => {
        if (!like) {
          return res.status(400).json({
            success: false,
            message: "Haven't liked it yet"
          })
        }
        return like.destroy()
      })
      .then(() => res.status(200).json({ success: true, message: 'Unliked successfully' }))
      .catch(err => next(err))
  },
  getTweetReplies: (req, res, next) => {
    const TweetId = Number(req.params.tweet_id)
    return Promise.all([
      Tweet.findByPk(TweetId),
      Reply.findAll({
        where: { TweetId },
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] }, // 先撈reply使用者本身的資料
          { model: Tweet, attributes: ['id'], include: [{ model: User, attributes: ['id', 'account'] }] } // 再撈tweet跟建立tweet的人的資料
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
    ])
      .then(([tweet, replies]) => {
        if (!tweet) throw new Error('tweet not found')
        res.status(200).json(replies)
      })
      .catch(err => next(err))
  },
  replyTweet: (req, res, next) => {
    const UserId = Number(helpers.getUser(req)?.id)
    const TweetId = Number(req.params.tweet_id)
    const { comment } = req.body
    if (!comment) throw new Error('comment is required')
    if (!TweetId) throw new Error('tweet not found')
    // 先找到tweet的資料，再新增留言
    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) throw new Error('tweet not found')
        return Reply.create({
          comment,
          UserId,
          TweetId
        })
      })
      .then(reply => res.status(200).json({ success: true, message: 'Reply successfully' }))
      .catch(err => next(err))
  }
}

module.exports = tweetController
