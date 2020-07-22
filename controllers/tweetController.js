const db = require('../models')
const Tweet = db.Tweet
const Like = db.Like
const User = db.User
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
    Tweet.findOne({ where: { id: req.params.tweet_id } })
      .then(tweet => {
        if (!tweet) return res.json({ status: 'error', message: '找不到此筆推文資料' })

        // 撈取推文作者
        const getAuthor = User.findByPk(tweet.UserId)

        // 撈取此使用者是否按這則貼文讚
        const getUserLike = Like.findOne({
          where: { TweetId: tweet.id, UserId: User.id }
        })

        Promise.all([getAuthor, getUserLike])
          .then(results => {
            // 結果 1
            if (!results[0]) return res.json({ status: 'error', message: '找不到推文者資料' })
            const authorData = { ...results[0].toJSON() }
            authorData.isAdmin = Boolean(Number(authorData.role)) // role 轉成 isAdmin
            delete authorData.role
            delete authorData.password // 刪除敏感資訊

            // 結果 2
            const isLiked = (results[1]) ? true : false

            return res.json({
              status: 'success',
              message: '找到指定的貼文',
              data: {
                ...tweet.toJSON(),
                isLiked,
                user: authorData
              }
            })
          })
          .catch(err => {
            console.log(err)
            return res.json({ status: 'error', message: '找尋推文者或按讚資料失敗' })
          })
      })
      .catch(err => {
        console.log(err)
        return res.json({ status: 'error', message: '找尋此筆推文資料失敗' })
      })
  }
}

module.exports = tweetController
