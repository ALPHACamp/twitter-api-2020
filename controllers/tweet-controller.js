const { Tweet, User, Like, sequelize } = require('../models')
const { getUser } = require('../_helpers')

const tweetController = {
  // 瀏覽所有推文
  getTweets: async (req, res, next) => {
    try {
      const userId = getUser(req).id
      const [tweets, likes] = await Promise.all([
        Tweet.findAll({
          order: [['createdAt', 'desc']],
          include: [{
            model: User,
            attributes: ['account', 'name', 'avatar']
          }],
          attributes: {
            include: [
              [
                sequelize.literal(
                  '(SELECT COUNT(*) FROM `Likes` WHERE `Likes`.`TweetId` = `Tweet`.`id`)' // 在資料庫篩選此篇推文所有like數量
                ),
                'likesNum'
              ],
              [
                sequelize.literal(
                  '(SELECT COUNT(*) FROM `Replies` WHERE `Replies`.`TweetId` = `Tweet`.`id`)' // 在資料庫篩選此篇推文所有回覆數量
                ),
                'repliesNum'
              ]
            ]
          },
          nest: true,
          raw: true
        }),
        Like.findAll({ where: { UserId: userId } })
      ])
      const result = tweets.map(tweet => ({
        ...tweet,
        isLiked: likes.some(like => like.TweetId === tweet.id) // 若Like model中，登入者id = 推文id，代表登入者有點讚，回傳ture，反之false
      }))
      return res.status(200).json(result)
    } catch (err) {
      return next(err)
    }
  },
  // 瀏覽特定推文
  getTweet: async (req, res, next) => {
    try {
      const userId = getUser(req).id
      const [tweet, likes] = await Promise.all([
        Tweet.findByPk(req.params.id, {
          order: [['createdAt', 'desc']],
          include: [{
            model: User,
            attributes: ['account', 'name', 'avatar']
          }],
          attributes: {
            include: [
              [
                sequelize.literal(
                  '(SELECT COUNT(*) FROM `Likes` WHERE `Likes`.`TweetId` = `Tweet`.`id`)'
                ),
                'likesNum'
              ],
              [
                sequelize.literal(
                  '(SELECT COUNT(*) FROM `Replies` WHERE `Replies`.`TweetId` = `Tweet`.`id`)'
                ),
                'repliesNum'
              ]
            ]
          }
        }),
        Like.findAll({ where: { UserId: userId } })
      ])
      const tweetData = tweet.toJSON()
      tweetData.isLiked = likes.some(like => like.TweetId === tweet.id)
      return res.status(200).json(tweetData)
    } catch (err) {
      return next(err)
    }
  },
  // 發佈一則推文
  postTweet: async (req, res, next) => {
    try {
      const userId = getUser(req).id
      const { description } = req.body
      if (!description) {
        throw new Error('此欄位不能空白！')
      } else if (description.length > 140) {
        throw new Error('此欄位不能多餘140字！')
      }
      const newTweet = await Tweet.create({
        description,
        UserId: userId
      })
      const tweetData = newTweet.toJSON()
      return res.status(200).json(tweetData)
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = tweetController
