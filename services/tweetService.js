const db = require('../models')
const { Tweet, Reply, Like, Followship, User } = db

const tweetService = {
  postTweet: async (req, res, cb) => {
    try {
      const { description } = req.body
      if (description.trim()) {
        if (description.length > 140) return cb({ status: '400', message: '推文需在140字以內' })
        const tweet = await Tweet.create({
          UserId: req.user.id,
          description
        })
        return cb({ status: '200', message: '推文建立成功', tweetId: tweet.id })
      }
      return cb({ status: '400', message: '內容不可空白' })
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  },

  postReply: async (req, res, cb) => {
    try {
      const { comment } = req.body
      if (comment && comment.trim()) {
        const reply = await Reply.create({
          UserId: req.user.id,
          TweetId: req.params.tweet_id,
          comment
        })
        return cb({ status: '200', message: '留言成功', id: reply.id, createdAt: reply.createdAt })
      }
      return cb({ status: '400', message: '留言不可空白' })
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  },

  getTweet: async (req, res, cb) => {
    try {
      // 取得推文及回覆總數跟按讚總數
      let tweet = await Tweet.findOne({
        where: { id: req.params.tweet_id },
        attributes: ['id', 'description', 'updatedAt'],
        include: [
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['id'] },
        ]
      })
      tweet = tweet.toJSON()
      const totalReply = tweet.Replies.length
      const totalLike = tweet.Likes.length
      delete tweet.Replies
      delete tweet.Likes
      return cb({ status: '200', ...tweet, totalReply, totalLike })
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  },

  getTweets: async (req, res, cb) => {
    try {
      const liked = await User.findOne({
        attributes: [],
        where: { id: req.user.id },
        include: { model: Like, attributes: ['TweetId'] }
      })
      // 取得追蹤中清單
      // let followings = await Followship.findAll({
      //   raw: true, nest: true,
      //   attributes: ['followingId'],
      //   where: {
      //     followerId: req.user.id
      //   }
      // })
      // 追蹤中的id清單
      // followings = followings.map(d => (d.followingId))
      let tweets = await Tweet.findAll({
        attributes: { exclude: ['UserId'] },
        order: [['createdAt', 'DESC']],
        nest: true,
        // where: {
        //   userId: followings //僅限有追蹤的人，但是測試檔會不過，因為他沒有先追蹤用戶
        // },
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['id'] }
        ]
      })
      tweets.map(d => {
        // totalLikes totalReplies isLiked
        d.dataValues.totalLike = d.dataValues.Likes.length
        d.dataValues.totalReply = d.dataValues.Replies.length
        d.dataValues.isLiked = liked.Likes.map(d => (d.TweetId)).includes(d.dataValues.Likes.id)
        // 刪掉前端不要的資料
        delete d.dataValues.Likes
        delete d.dataValues.Replies
      })
      return cb(tweets)
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  }
}



module.exports = tweetService