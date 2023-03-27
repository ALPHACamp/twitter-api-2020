const { User, Tweet, Like, Reply } = require('../models')
const { getUser } = require('../_helpers')
const { tryCatch } = require('../helpers/tryCatch')
const { ReqError, AuthError } = require('../helpers/errorInstance')
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')

const adminController = {
  signIn: tryCatch(async (req, res) => {
    const userData = getUser(req).toJSON()
    delete userData.password
    if (userData.role === 'user') throw new ReqError('帳號不存在！')
    const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
    res.status(200).json({
      data: {
        token,
        user: userData
      }
    })
  }),
  signInFail: (error, req, res, next) => {
    if (error instanceof ReqError) return next(error)
    error = new AuthError(req.session.messages)
    next(error)
  },
  getUsers: async (req, res, next) => { // 可優化 將SQL語法轉為Sequelize
    try {
      const data = await User.findAll({
        attributes: [
          'id', 'account', 'name', 'avatar', 'background',
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.User_id = User.id)'), 'tweetsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes INNER JOIN Tweets ON Likes.Tweet_id = Tweets.id WHERE Tweets.User_id = User.id)'), 'likesCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM `Followships` WHERE `Followships`.`following_id` = `User`.`id`)'), 'followingsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM `Followships` WHERE `Followships`.`follower_id` = `User`.`id`)'), 'followersCount']
        ],
        group: ['User.id'],
        nest: true
      })
      const result = data.map(data => {
        return {
          ...data.toJSON()
        }
      })

      result.sort((a, b) => b.tweetsCount - a.tweetsCount)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          { model: User, as: 'poster', attributes: ['id', 'name', 'account', 'avatar'] }
        ],
        nest: true
      })
      res.status(200).json(tweets)
    } catch (error) {
      next(error)
    }
  },
  deleteTweet: async (req, res, next) => { // 待優化: 一個動作可以一次刪除完有關該貼文的資料
    try {
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error("tweet didn't exist!")
      const [Replies, Likes] = await Promise.all([ // 找到與此條貼文有關留言與案讚資料
        Reply.findAll({ where: { TweetId } }),
        Like.findAll({ where: { TweetId } })
      ])
      Replies.forEach(reply => reply.destroy()) // 並刪除與這條貼文有關的資料
      Likes.forEach(like => like.destroy())
      const deletedTweet = await tweet.destroy()
      res.status(200).json(deletedTweet)
    } catch (error) {
      next(error)
    }
  }
}
module.exports = adminController
