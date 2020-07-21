const db = require('../models')
const Tweet = db.Tweet
const Like = db.Like
const helpers = require('../_helpers.js')

const tweetController = {
  postTweet: (req, res) => {
    // 初始值去除空白字元
    const description = (req.body.description) ? req.body.description.trim() : req.body.description

    if (!description) return res.json({ status: 'error', message: '內容請勿空白' })
    if (description.length > 140) return res.json({ status: 'error', message: '內容請勿超過 140 個字' })

    return Tweet.create({
      UserId: helpers.getUser(req).id,
      description
    })
      .then(tweet => {
        return res.json({ status: 'success', message: '成功建立一則推文資料' })
      })
      .catch(err => {
        console.log(err) // error for us to see
        return res.json({ status: 'error', message: '建立推文資料失敗' }) // fail message for user to know
      })
  },

  getTweet: (req, res) => {
    const User = helpers.getUser(req)
    let isLiked

    Tweet.findOne({ where: { id: req.params.tweet_id } })
      .then(async (tweet) => {

        if (!tweet) return res.json({ status: 'error', message: '找不到此筆推文資料' })

        await Like.findOne({ where: { UserId: User.id } })
          .then(like => {
            isLiked = (like) ? true : false
          })

        // role 轉成 isAdmin
        const userData = { ...User.toJSON() }
        userData.isAdmin = Boolean(Number(userData.role))
        delete userData.role

        return res.json({
          status: 'success',
          message: '找到指定的貼文',
          data: {
            ...tweet.toJSON(),
            isLiked,
            user: userData
          }
        })
      })
      .catch(err => {
        console.log(err)
        return res.json({ status: 'error', message: '找尋此筆推文資料失敗' })
      })
  }
}

module.exports = tweetController
