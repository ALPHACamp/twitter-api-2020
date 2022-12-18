const sequelize = require('sequelize')
const helpers = require('../_helpers')
const { User, Tweet, Like, Reply } = require('../models')

const user2Controller = {
  getUserTweets: (req, res, next) => {
    const currentUserId = helpers.getUser(req)?.id // 正在使用網站的使用者id
    const UserId = Number(req.params.id) // 要查看的特定使用者id

    // 要撈特定使用者資料/tweet資料、現在使用者的like資料
    return Promise.all([
      User.findByPk(UserId),
      Tweet.findAll({
        where: { UserId },
        attributes: [
          'id', 'description', 'createdAt',
          [
            sequelize.literal('(SELECT COUNT(*) FROM Replies AS replyCount WHERE tweet_id = Tweet.id)'), 'replyCount'
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM Likes AS likeCount WHERE tweet_id = Tweet.id)'), 'likeCount'
          ]
        ],
        order: [['createdAt', 'DESC']],
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        raw: true,
        nest: true
      }),
      Like.findAll({ where: { UserId: currentUserId }, raw: true })
    ])
      .then(([user, tweets, likes]) => {
        if (!user) throw new Error("User didn't exist")
        // console.log(likes)
        // console.log(tweets)
        const userData = tweets.map(tweet => ({
          ...tweet,
          isLiked: likes.some(like => like.TweetId === tweet.id && currentUserId === like.UserId)
        }))
        res.status(200).json(userData)
      })
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    // const currentUserId = helpers.getUser(req)?.id // 正在使用網站的使用者id
    const UserId = Number(req.params.id) // 要查看的特定使用者id

    // 要撈特定使用者資料/reply資料
    return Promise.all([
      User.findByPk(UserId),
      Reply.findAll({
        where: { UserId },
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
          { model: Tweet, attributes: ['id'], include: [{ model: User, attributes: ['id', 'account'] }] }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
    ])
      .then(([user, replies]) => {
        if (!user) throw new Error("User didn't exist")
        res.status(200).json(replies)
      })
      .catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {
    const currentUserId = helpers.getUser(req)?.id // 正在使用網站的使用者id
    const UserId = Number(req.params.id) // 要查看的特定使用者id

    // 要撈特定使用者資料/特定使用者like的資料/現在使用者like的資料(要判斷現在使用者是否like)
    return Promise.all([
      User.findByPk(UserId),
      Like.findAll({
        where: { UserId },
        attributes: ['id', 'TweetId', 'createdAt'],
        include: [{
          model: Tweet,
          attributes: ['id', 'description', 'createdAt',
            [
              sequelize.literal('(SELECT COUNT(*) FROM Replies AS replyCount WHERE tweet_id = Tweet.id)'), 'replyCount' // 回傳留言數
            ],
            [
              sequelize.literal('(SELECT COUNT(*) FROM Likes AS likeCount WHERE tweet_id = Tweet.id)'), 'likeCount' // 回傳按讚數
            ]],
          include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }]
        }],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      }),
      Like.findAll({ where: { UserId: currentUserId }, raw: true })
    ])
      .then(([user, likes, currentUserlikes]) => {
        if (!user) throw new Error("User didn't exist")
        const currentUserlikeList = currentUserlikes.map(like => like.TweetId)
        const data = likes.map(like => ({
          ...like,
          isLiked: currentUserlikeList.some(TweetId => TweetId === like.TweetId)
        }))
        res.status(200).json(data)
      })
      .catch(err => next(err))
  }

}

module.exports = user2Controller
