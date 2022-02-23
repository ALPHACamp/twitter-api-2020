const db = require('../models')
const { Tweet } = db
const { User } = db
const { Like } = db
const { Reply } = db

const tweetServices = {
  getTweets: (req, cb) => {
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
            userLiked: i.Likes.some(i => i.UserId === req.user.dataValues.id),
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
  },
  getTweet: (req, cb) => {
    Tweet.findByPk(req.params.id, { include: [User, Like, Reply] })
      .then(tweet => {
        if (tweet === null) throw new Error('資料庫內沒有推文資料，可能是輸入錯誤的tweetId')
        const Data = tweet.toJSON()
        console.log(Data)
        const tweetData = {
          id: Data.id,
          userData: {
            id: Data.User.id,
            account: Data.User.account,
            name: Data.User.name,
            avatar: Data.User.avatar
          },
          description: Data.description,
          replyAmount: Data.Replies.length,
          likeAmount: Data.Likes.length,
          userLiked: Data.Likes.some(i => i.UserId === req.user.dataValues.id),
          createdAt: Data.createdAt
        }
        return cb(null, tweetData)
      })
      .catch(err => cb(err, null))
  },
  likeTweet: (req, cb) => {
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (tweet === null) throw new Error('輸入錯誤的tweetId，沒有此推文')
        Like.create({
          userId: req.user.dataValues.id,
          tweetId: req.params.id
        })
          .then(() => cb(null, '成功將推文加入最愛'))
          .catch(err => cb(err, null))
      })
      .catch(err => cb(err, null))
  }
}

module.exports = tweetServices
