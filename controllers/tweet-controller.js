const createError = require('http-errors')
// const { getUser } = require('../_helpers')
const helpers = require('../_helpers')
const { User, Tweet, Like, sequelize, Reply } = require('../models')

// if (!user) throw createError(404, '該使用者不存在')

const tweetController = {
  getTweets: (req, res, next) => {
    const loginUser = helpers.getUser(req)

    // 找 tweet table, 對應的 user table，取 user 資料
    // 從 like table 找出該 tweet.id，算出該推文多少 like
    // 從 replies table 找出該 tweet.id，算出該推文多少 replies
    Promise.all([
      Tweet.findAll({
        raw: true,
        nest: true,
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] }
        ],
        attributes: {
          include:
            [
              [sequelize.literal('( SELECT COUNT(*) FROM Likes AS likedCount  WHERE Tweet_id = Tweet.id)'), 'likeCounts'],
              [sequelize.literal('( SELECT COUNT(*) FROM Replies AS repliesCount  WHERE Tweet_id = Tweet.id)'), 'replyCounts']
            ]
        },
        order: [['createdAt', 'DESC']]
      }),
      Like.findAll({})
    ])
      .then(([tweets, likes]) => {
        const result = tweets.map(tweet => ({
          ...tweet,
          // loginUser 是否 like 過
          isLiked: likes.some(like => like.UserId === loginUser.id)
        }))
        return res.json(result)
      })
      .catch(err => next(err))
  },
  postTweets: (req, res, next) => {
    // const loginUser = getUser(req)
    // const UserId = loginUser.id
    const UserId = helpers.getUser(req).id
    const { description } = req.body
    if (!description) throw createError(400, '內容不可空白')
    if (description.length > 140) throw createError(422, '字數不可超過 140 字')

    User.findByPk(UserId)
      .then(user => {
        if (!user) throw createError(404, '該使用者不存在')

        return Tweet.create({
          description,
          UserId
        })
      })
      .then(() => res.json({
        status: 'success',
        message: '推文新增成功'
      }))
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const loginUser = helpers.getUser(req)
    const TweetId = req.params.tweet_id

    Promise.all([
      // 在 tweet table 找到該 TweetId 資料，包含關聯 user 的資料
      Tweet.findByPk(TweetId, {
        raw: true,
        nest: true,
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] }
        ],
        attributes: {
          // 計算 reply, like 數量
          include:
            [
              [sequelize.literal('( SELECT COUNT(*) FROM Replies AS repliesCount  WHERE Tweet_id = Tweet.id)'), 'replyCounts'],
              [sequelize.literal('( SELECT COUNT(*) FROM Likes AS likedCount  WHERE Tweet_id = Tweet.id)'), 'likeCounts']
            ]
        }
      }),
      // 找 like table 和這 TweetId 的資料
      Like.findAll({ where: { TweetId }, raw: true })
    ])
      .then(([tweet, likes]) => {
        if (!tweet) throw createError(404, '該推文不存在')
        // loginUser 是否 like 過
        tweet.isLiked = likes.some(like => like.UserId === loginUser.id)

        return res.json(tweet)
      })
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    const TweetId = Number(req.params.tweet_id)

    // 在 tweet table 找出這則 TweetId
    // 在 reply table 找出這則 TweetId，回覆對應的 user 資料，回覆的推文的 user 資料
    Promise.all([
      Tweet.findByPk(TweetId),
      Reply.findAll({
        where: { TweetId },
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Tweet, attributes: { exclude: ['description', 'createdAt', 'updatedAt'] }, include: { model: User, attributes: ['id', 'account'] } }
        ],
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([tweet, replies]) => {
        if (!tweet) throw createError(404, '該推文不存在')

        return res.json(replies)
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
