const { Tweet, User, Reply, Like } = require('../models')
const sequelize = require('sequelize')
const helper = require('../_helpers')
const tweetServices = {
  getTweets: async (req, cb) => {
    try {
      // 找出所有tweet 包含喜歡數及回覆數和user資訊
      const tweets = await Tweet.findAll({
        include: [
          { model: Like, attributes: [] },
          { model: Reply, attributes: [] },
          { model: User, attributes: ['account', 'name', 'avatar'] }
        ],
        attributes: {
          include: [
            [
              sequelize.fn(
                'COUNT',
                sequelize.fn('DISTINCT', sequelize.col('Likes.id'))
              ),
              'likeCount'
            ],
            [
              sequelize.fn(
                'COUNT',
                sequelize.fn('DISTINCT', sequelize.col('Replies.id'))
              ),
              'replyCount'
            ]
          ]
        },
        group: ['Tweet.id'],
        order: [
          ['createdAt', 'DESC']
        ]
      })
      // 找出目前使用者喜歡的推文
      const likedTweets = await Like.findAll({
        where: { userId: helper.getUser(req).id },
        attributes: ['tweetId'],
        raw: true
      })
      const likedData = likedTweets.map(data =>
        data.tweetId
      )
      const result = tweets.map(tweet => ({
        ...tweet.toJSON(),
        isLiked: likedData.includes(tweet.id)
      }))
      return cb(null, result)
    } catch (err) {
      cb(err)
    }
  },
  postTweet: async (req, cb) => {
    try {
      const userId = helper.getUser(req).id
      const { description } = req.body
      if (!description) throw new Error('推文不能為空白')
      const tweet = await Tweet.create({
        userId,
        description
      })
      return cb(null, tweet)
    } catch (err) {
      cb(err)
    }
  },
  getTweet: async (req, cb) => {
    try {
      const userId = helper.getUser(req).id
      // 找出單一tweet 包含其發文者 喜歡及回覆資訊 回覆依照新到舊排序
      const tweetData = await Tweet.findByPk(req.params.tweetId, {
        include: [
          { model: Like, attributes: ['id', 'UserId', 'createdAt'] },
          { model: Reply, include: { model: User, attributes: ['account', 'name', 'avatar'] } },
          { model: User, attributes: ['account', 'name', 'avatar'] }
        ],
        order: [
          [Reply, 'createdAt', 'DESC']
        ]
      })
      if (!tweetData) throw new Error('您尋找的推文已不存在')
      // 列出此tweet所有likes的userId
      const likedUsersId = tweetData.toJSON().Likes.map(data =>
        data.UserId
      )
      const tweet = {
        ...tweetData.toJSON(),
        likeCount: tweetData.Likes.length,
        replyCount: tweetData.Replies.length,
        isLiked: likedUsersId.includes(userId)
      }
      return cb(null, tweet)
    } catch (err) {
      cb(err)
    }
  },
  putTweet: async (req, cb) => {
    try {
      const { description } = req.body
      console.log(description);
      console.log(helper.getUser(req).id);
      if (!description) throw new Error('推文不能為空白')
      const tweet = await Tweet.findOne({
        where: {
          UserId: helper.getUser(req).id,
          id: req.params.tweetId
        },
        attributes: ['id', 'description']
      })
      if (tweet === null) throw new Error('無編輯權限 或 貼文不存在')
      tweet.description = description
      await tweet.save()
      return cb(null, tweet)
    } catch (err) {
      cb(err)
    }
  }
}
module.exports = tweetServices