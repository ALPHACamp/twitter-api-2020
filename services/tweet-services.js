const db = require('../models')
const { Tweet } = db
const { User } = db
const { Like } = db
const { Reply } = db

const tweetServices = {
  getTweets: (req, cb) => {
    // 顯示使用者是否將該貼文加入最愛的並未完成，暫時用userLiked: true代替
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, Like, Reply]
    })
      .then(tweet => {
        if (tweet.length === 0) throw new Error('資料庫內沒有推文資料')
        const tweetData = tweet.map(i => i.get({ plain: true }))
          .map(i => ({
            id: i.id,
            userData: {
              id: i.User.id,
              account: i.User.account,
              name: i.User.name,
              avatar: i.User.avatar
            },
            description: i.description,
            replyAmount: i.Replies.length,
            likeAmount: i.Likes.length,
            userLiked: true,
            createdAt: i.createdAt
          }))
        return cb(null, tweetData)
      })
      .catch(err => cb(err, null))
  },
  postTweets: (req, cb) => {
    Tweet.create({
      description: req.body.description,
      userId: req.user.dataValues.id
    })
      .then(() => cb(null, '成功建立推文'))
      .catch(err => cb(err, null))
  }
}

module.exports = tweetServices
