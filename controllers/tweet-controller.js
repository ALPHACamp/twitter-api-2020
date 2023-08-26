const { Tweet, User, Like, Reply, sequelize } = require('../models')
const { getUser } = require('../_helpers')
const { relativeTime, simpleDate, simpleTime } = require('../helpers/datetime-helper')

const tweetController = {
  // 看所有貼文
  getTweets: (req, res, next) => {
    const loginUserId = getUser(req).toJSON().id

    return Tweet.findAll({
      nest: true,
      raw: true,
      include: {
        model: User,
        attributes: ['id', 'name', 'avatar', 'account']
      },
      attributes: [
        'id',
        'description'
        [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
        [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
        [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.UserId = ${loginUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
      ],
      order: [['createdAt', 'DESC']]
    })
    .then(data => data.map(tweet => ({
      ...tweet,
      createdAt : relativeTime(tweet.createdAt)
    })))
    .then(tweet => res.status(200).json(tweet))
    .catch(err => next(err))
  },
  // 新增一筆貼文
  postTweet: (req, res, next) => {
    const limitWords = 140
    const { description } = req.body
    const loginUserId = getUser(req).id

    if (!loginUserId) throw new Error('帳號不存在！')
    if (!description.trim()) throw new Error('內容不可空白')
    if (description.length > limitWords ) throw new Error(`字數不能大於 ${limitWords} 字`)
    
    return Tweet.create({
      description,
      userId
    })
    .then(tweet => {
      res.status(200).json(tweet)
    })
    .catch(err => next(err))
  },
  // 瀏覽一筆貼文
  getTweet: (req, res, next) => {
    const loginUserId = getUser(req).toJSON().id
    if (!loginUserId) throw new Error('帳號不存在！')

    return Tweet.findByPk(req.params.id, {
      include: 
        {
          model: User,
          attributes: ['id', 'name', 'avatar', 'account']
        },
      attributes: [
          'id',
          'createdAt',
          'description',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.UserId = ${loginUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
        ],
        raw: true,
        nest:true
    })
    .then(tweet => {
      if (!tweet) {
        return res.status(404).JSON({
          status: 'error',
          message: '推文不存在',
        })
      }
    console.log(simpleTime(tweet.createdAt))
      tweet.createdAt = simpleTime(tweet.createdAt) + ' • ' + simpleDate(Tweet.createdAt)
      return res.status(200).json(tweet)   
    })
    .catch(err => next(err))
  }
}

module.exports = tweetController
