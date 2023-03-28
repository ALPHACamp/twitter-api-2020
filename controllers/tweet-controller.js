const createError = require('http-errors')
const helpers = require('../_helpers')
const { User, Tweet, Like, sequelize, Reply } = require('../models')
const timeFormat = require('../helpers/date-helpers')
const { Op } = require('sequelize')

const tweetController = {
  getTweets: (req, res, next) => {
    const loginUserId = helpers.getUser(req).id

    // 找 tweet table, 對應的 user table，取 user 資料
    // 從 like table 找出該 tweet.id，算出該推文多少 like
    // 從 replies table 找出該 tweet.id，算出該推文多少 replies
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] }
      ],
      attributes: {
        include:
            [
              [sequelize.literal('( SELECT COUNT(*) FROM Likes AS likedCount  WHERE Tweet_id = Tweet.id)'), 'likeCount'],
              [sequelize.literal('( SELECT COUNT(*) FROM Replies AS repliesCount  WHERE Tweet_id = Tweet.id)'), 'replyCount'],
              [sequelize.literal(`EXISTS(SELECT id FROM Likes WHERE Likes.Tweet_id = Tweet.id AND Likes.User_id = ${loginUserId})`), 'isLiked']
              // [sequelize.literal(`CASE WHEN EXISTS(SELECT id FROM Likes WHERE Likes.Tweet_id = Tweet.id AND Likes.User_id = ${loginUserId}) THEN 1 ELSE 0 END`), 'isLiked']
              // 這個跑不出來
              // [sequelize.cast(sequelize.literal(`EXISTS(SELECT id FROM Likes WHERE Likes.Tweet_id = Tweet.id AND Likes.User_id = ${loginUserId})`), 'BOOLEAN'), 'isLiked']
            ]
      },
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const result = tweets.map(tweet => ({
          ...tweet,
          // tweet 時間格式修改
          createdAt: timeFormat(tweet.createdAt),
          // isLike 轉換成 true/ false
          isLiked: !!tweet.isLiked
          // isLiked: Boolean(tweet.isLiked)
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
    if (description.length > 140) throw createError(400, '字數不可超過 140 字')

    return Tweet.create({
      description,
      UserId
    })
      .then(() => res.json({
        status: 'success',
        message: '推文新增成功'
      }))
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const loginUserId = helpers.getUser(req).id
    const TweetId = Number(req.params.tweet_id)

    // 在 tweet table 找到該 TweetId 資料，包含關聯 user 的資料
    return Tweet.findByPk(TweetId, {
      raw: true,
      nest: true,
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] }
      ],
      attributes: {
        // 計算 reply, like 數量
        include:
            [
              [sequelize.literal('( SELECT COUNT(*) FROM Replies AS repliesCount  WHERE Tweet_id = Tweet.id)'), 'replyCount'],
              [sequelize.literal('( SELECT COUNT(*) FROM Likes AS likedCount  WHERE Tweet_id = Tweet.id)'), 'likeCount'],
              [sequelize.literal(`EXISTS(SELECT id FROM Likes WHERE Likes.Tweet_id = Tweet.id AND Likes.User_id = ${loginUserId})`), 'isLiked']
            ]
      }
    })
      .then(tweet => {
        if (!tweet) throw createError(404, '該推文不存在')
        // loginUser 是否 like 過
        tweet.isLiked = !!tweet.isLiked
        // 時間格式轉換
        tweet.createdAt = timeFormat(tweet.createdAt)

        return res.json(tweet)
      })
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    const TweetId = Number(req.params.tweet_id)

    // 在 tweet table 找出這則 TweetId
    // 在 reply table 找出這則 TweetId，回覆對應的 user 資料，回覆的推文的 user 資料
    return Promise.all([
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
        const result = replies.map(reply => ({
          ...reply.toJSON(),
          createdAt: timeFormat(reply.createdAt)
        }))

        return res.json(result)
      })
      .catch(err => next(err))
  },
  postReplies: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = Number(req.params.tweet_id)
    const { comment } = req.body
    if (comment.length > 140) throw createError(400, '字數不可超過 140 字')
    if (!comment) throw createError(400, '內容不可空白')

    // 找 tweet.id 對應貼文
    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) throw createError(404, '該推文不存在')

        // 針對這 TweetId, UserId 來新增 reply
        return Reply.create({
          comment,
          UserId,
          TweetId
        })
      })
      .then(() => res.json({
        status: 'success',
        message: '新增回覆成功'
      }))
      .catch(err => next(err))
  },
  postLikes: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = Number(req.params.tweet_id)

    // 找 tweet.id 對應貼文 & 找 like table 登入使用者(UserId) 該貼文(TweetId)
    return Promise.all([
      Tweet.findByPk(TweetId, { raw: true }),
      Like.findOne({
        where: { UserId, TweetId }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw createError(404, '該推文不存在')
        if (like) throw createError(404, '此 like 已存在')

        // 在 like table 建立
        return Like.create({
          UserId,
          TweetId
        })
      })
      .then(() => res.json({
        status: 'success',
        message: '使用者點擊喜歡貼文成功'
      }))
      .catch(err => next(err))
  },
  postUnLikes: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = Number(req.params.tweet_id)

    return Promise.all([
      Tweet.findByPk(TweetId, { raw: true }),
      Like.findOne({
        where: { UserId, TweetId },
        attributes: ['id', 'UserId', 'TweetId', 'createdAt', 'updatedAt']
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw createError(404, '該推文不存在')
        if (!like) throw createError(404, '已經 unlike 不要再逼它惹')

        // 移除 like table 裡的 UserId & TweetId 資料
        return like.destroy()
      })
      .then(() => res.json({
        status: 'success',
        message: '使用者移除喜歡貼文成功'
      }))
      .catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    const loginUserId = helpers.getUser(req).id
    const topUserLimit = 10

    // user table 找出 role 為 user，且不是自己
    // 用 followerCounts 做排序，資料庫回傳 10 筆資料
    // 計算 Followships 裡面的 followerCounts
    // exclude 不需要的資料
    return User.findAll({
      where: { role: 'user', id: { [Op.ne]: loginUserId } },
      limit: topUserLimit,
      attributes: {
        include: [
          [sequelize.literal(
            '(SELECT COUNT(*) FROM Followships WHERE following_id = user.id )'), 'followerCount'],
          [sequelize.literal(`EXISTS(SELECT id FROM Followships WHERE following_id = user.id AND follower_id = ${loginUserId})`), 'isFollowed']
        ],
        exclude: ['password', 'email', 'cover', 'role', 'introduction', 'createdAt', 'updatedAt']
      },
      include: [{
        model: User,
        as: 'Followers',
        attributes: ['id', 'name']
      }],
      order: [[sequelize.literal('followerCount'), 'Desc']]
    })
      .then(users => {
        const result = users.map(users => {
          // data 和 Followers 拆開
          // 創建 data.isFollowed，當 Followers 的 id 是登入者的，代表有追蹤 (isFollowed)
          const { Followers, ...data } = users.toJSON()
          data.isFollowed = !!data.isFollowed

          return data
        })
        return res.json(result)
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
