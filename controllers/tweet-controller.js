// 引入模組
const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  // 取得所有推文
  getTweets: (req, res, next) => {
    // 找到所有推文，並關連User
    Tweet.findAll({
      include: [
        User,
        Reply,
        Like
      ],
      order: [['createdAt', 'DESC']],
    })
      .then(tweets => {
        const data = tweets.map(tweet => {
          tweet = tweet.toJSON()
          return {
            id: tweet.id,
            description: tweet.description,
            createdAt: tweet.createdAt,
            User: {
              id: tweet.User.id,
              account: tweet.User.account,
              name: tweet.User.name,
              avatar: tweet.User.avatar
            },
            replyCount: tweet.Replies ? tweet.Replies.length : 0,
            likeCount: tweet.Likes ? tweet.Likes.length : 0,
            isLiked: helpers.getUser(req).Likes ? helpers.getUser(req).Likes.some(u => u.TweetId === tweet.id) : false
          }
        })
        // 回傳陣列-物件json
        return res.json(data)
      })
      .catch(err => next(err))
  },

  // 取得特定推文
  getTweet: (req, res, next) => {
    // 以tweet_id取得Tweet推文，並關連Reply-User
    Tweet.findByPk(req.params.tweet_id, {
      include: [
        User,
        Like,
      ]
    })
      .then(tweet => {
        // 檢查推文是否存在
        if (!tweet) return res.json({ status: 'error', message: '推文不存在' })

        // 將tweet轉換json物件
        tweet = tweet.toJSON()
        // 調整需回傳的欄位，並加入likedCount、isLiked欄位
        const data = {
          id: tweet.id,
          description: tweet.description,
          createdAt: tweet.createdAt,
          User: {
            id: tweet.User.id,
            account: tweet.User.account,
            name: tweet.User.name,
            avatar: tweet.User.avatar
          },
          likeCount: tweet.Likes ? tweet.Likes.length : 0,
          isLiked: helpers.getUser(req).Likes ? helpers.getUser(req).Likes.some(u => u.TweetId === tweet.id) : false
        }
        // 回傳物件json
        return res.json(data)
      })
      .catch(err => next(err))
  },

  // 新增一筆推文
  postTweet: (req, res, next) => {
    // 從body取得description
    const { description } = req.body

    // 檢查description不可空白
    if (!description.trim()) throw new Error('推文內容不可是空白的!')

    // 使用helpers.getUser取得登入者id，取得登入者使用者資料
    return User.findByPk(helpers.getUser(req).id, {
      raw: true,
      nest: true
    })
      .then(user => {
        // 檢查使用者是否存在
        if (!user) throw new Error('使用者不存在!')

        // 將UserId與description 儲存進tweet資料庫
        return Tweet.create({
          UserId: user.id,
          description
        })
      })
      // 回傳新增的資料
      .then(newTweet => res.json(newTweet))
      .catch(err => next(err))
  },


}

// 匯出模組
module.exports = tweetController