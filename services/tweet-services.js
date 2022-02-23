const { Tweet, User, Like, Reply } = require('../models')

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
        Like.findOrCreate({
          where: {
            userId: req.user.dataValues.id,
            tweetId: req.params.id
          }
        })
          .then(() => cb(null, '成功將推文加入最愛'))
          .catch(err => cb(err, null))
      })
      .catch(err => cb(err, null))
  },
  unlikeTweet: (req, cb) => {
    Like.findOne({
      where: {
        userId: req.user.dataValues.id,
        tweetId: req.params.id
      }
    })
      .then(like => {
        if (like === null) throw new Error('輸入錯誤的tweetId，該推文沒有被使用者加入最愛')
        like.destroy().then(() => cb(null, '成功將推文從最愛中移除'))
      })
      .catch(err => cb(err, null))
  },
  addReply: (req, cb) => {
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (tweet === null) throw new Error('輸入錯誤的tweetId，沒有此推文')
        Reply.create({
          userId: req.user.dataValues.id,
          tweetId: req.params.id,
          comment: req.body.comment
        })
          .then(() => cb(null, '新增留言成功'))
          .catch(err => cb(err, null))
      })
      .catch(err => cb(err, null))
  },
  getReplies: (req, cb) => {
    Reply.findAll({
      where: { tweetId: req.params.id },
      order: [['createdAt', 'DESC']],
      include: [User, { model: Tweet, include: [User] }]
    })
      .then(reply => {
        if (reply.length === 0) throw new Error('此推文沒有任何回覆')
        const replyData = reply.map(i => i.get({ plain: true }))
          .map(i => ({
            id: i.id,
            comment: i.comment,
            replyerData: {
              id: i.User.id,
              account: i.User.account,
              name: i.User.name,
              avatar: i.User.avatar
            },
            TweetId: i.TweetId,
            tweetOwerId: i.Tweet.User.id,
            tweetOwerAccount: i.Tweet.User.account,
            createAt: i.createAt
          }))
        return cb(null, replyData)
      })
      .catch(err => cb(err, null))
  }
}

module.exports = tweetServices
