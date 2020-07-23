const db = require('../models')
const Tweet = db.Tweet
const Like = db.Like
const User = db.User
const helpers = require('../_helpers.js')

// 撈取此使用者是否按這則貼文讚 (return true or false)
const getUserLike = (tweet, UserId) => {
  return Like.findOne({
    where: { TweetId: tweet.id, UserId }
  })
    .then(like => {
      if (like) return true
      return false
    })
}

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
    Tweet.findOne({
      where: { id: req.params.tweet_id },
      include: [User]
    })
      .then(async (tweet) => {
        if (!tweet) return res.json({ status: 'error', message: '找不到此筆推文資料' })

        tweet = tweet.toJSON()
        const isLiked = await getUserLike(tweet, helpers.getUser(req).id)

        // 回傳值過濾 (role >> isAdmin, remove password)
        tweet.User.isAdmin = Boolean(Number(tweet.User.role))
        delete tweet.User.role
        delete tweet.User.password

        return res.json({
          status: 'success',
          message: '找到指定的貼文',
          ...tweet,
          isLiked
        })
      })
      .catch(err => {
        console.log(err)
        return res.json({ status: 'error', message: '找尋此筆推文資料失敗' })
      })
  },

  getTweets: (req, res) => {
    const tweetsData = []

    return Tweet.findAll({
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [User]
    })
      .then(async (tweets) => {
        for (const tweet of tweets) {
          const isLiked = await getUserLike(tweet, helpers.getUser(req).id)

          // 回傳值過濾 (role >> isAdmin, remove password)
          tweet.User.isAdmin = Boolean(Number(tweet.User.role))
          delete tweet.User.role
          delete tweet.User.password

          tweetsData.push({
            status: 'success',
            message: '成功找到推文資料',
            ...tweet,
            isLiked
          })
        }
      })
      .then(() => {
        return res.json(tweetsData)
      })
      .catch(err => {
        console.log(err)
        return res.json({ status: 'error', message: '找尋所有推文資料失敗' })
      })
  }
}

module.exports = tweetController
