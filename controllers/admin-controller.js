const { User, Tweet, Like, Reply } = require('../models')
const { getUser } = require('../_helpers')
const { tryCatch } = require('../helpers/tryCatch')
const { ReqError, AuthError } = require('../helpers/errorInstance')
const jwt = require('jsonwebtoken')

const adminController = {
  signIn: tryCatch(async (req, res) => {
    const userData = getUser(req).toJSON()
    delete userData.password
    if (userData.role === 'user') throw new ReqError('帳號不存在！')
    const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
    res.json({
      status: 'success',
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
  getUsers: async (req, res, next) => { // 可優化 查詢條件,排除password和不必要的資料
    try {
      const data = await User.findAll({
        include: [
          { model: Tweet, include: { model: Like } },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        nest: true
      })
      const result = data.map(data => {
        let totalLikes = 0
        data.Tweets.forEach(t => { // 把所有發過的tweet拿到的likes加總在一起
          totalLikes += t.Likes.length
        })
        return {
          tweetCount: data.Tweets.length,
          followersCount: data.Followers.length,
          followingsCount: data.Followings.length,
          totalLikes,
          ...data.toJSON()
        }
      })
      result.sort((a, b) => b.tweetCount - a.tweetCount)
      res.json({ status: 'success', data: result })
    } catch (error) {
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          { model: User, attributes: ['name'] }
        ]
      })
      res.json({ status: 'success', data: tweets })
    } catch (error) {
      next(error)
    }
  },
  deleteTweet: async (req, res, next) => { // 待優化: 一個動作可以一次刪除完有關該貼文的資料
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) throw new Error("tweet didn't exist!")
      const [Replies, Likes] = await Promise.all([ // 找到與此條貼文有關留言與案讚資料
        Reply.findAll({ where: { tweetId } }),
        Like.findAll({ where: { tweetId } })
      ])
      Replies.forEach(reply => reply.destroy()) // 並刪除與這條貼文有關的資料
      Likes.forEach(like => like.destroy())
      const deletedTweet = await tweet.destroy()
      res.json({ status: 'success', deletedTweet })
    } catch (error) {
      next(error)
    }
  }
}
module.exports = adminController
