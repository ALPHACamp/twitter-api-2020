// 引入模組
const { User, Tweet, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  // 取得所有推文
  getTweets: (req, res, next) => {
    // 找到所有推文，並關連User
    Tweet.findAll({
      include: User,
      order: [['createdAt', 'DESC']],
    })
      .then(tweets => {
        // 回傳陣列-物件json
        return res.json([...tweets])
      })
      .catch(err => next(err))
  },

  // 取得特定推文
  getTweet: (req, res, next) => {
    // 以tweet_id取得Tweet推文，並關連Reply-User
    Tweet.findByPk(req.params.tweet_id, {
      include: [{ model: Reply, include: User }],
      order: [['Replies', 'createdAt', 'DESC']]
    })
      .then(tweet => {
        // 回傳物件json
        return res.json(tweet.toJSON())
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