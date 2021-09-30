const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Followship = db.Followship
const Like = db.Like
const Unread = db.Unread
const Subscribe = db.Subscribe
const Sequelize = db.Sequelize
const sequelize = db.sequelize
const Op = db.Sequelize.Op
const { QueryTypes } = require('sequelize')

const tweetController = {
  allTweets: async (req, res) => {
    try{
      const id = req.user.id

      // 取出所有推文 按照時間排序 包含推文作者以及按讚數
      const tweets = await Tweet.findAll({
        include: [
          { model: Like, as: 'likes', attributes: { exclude: ['createdAt', 'updatedAt'] } },
          { model: Reply, as: 'replies', attributes: { exclude: ['comment', 'createdAt', 'updatedAt'] } },
          { model: User, as: 'user', attributes: { exclude: ['password', 'email', 'introduction', 'cover', 'createdAt', 'updatedAt'] } }
        ],
        order:[['createdAt', 'DESC']]
      })

      return res.json(tweets)
    }
    catch (error) {
      console.log(error)
    }
  },

  //取出右邊top10 twitter
  getTop10Twitter: async (req, res) => {
    const userId = req.params.id
    try{
      const topTwitters = await Followship.findAll({
        attributes: ['followingId', [sequelize.fn('count', sequelize.col('followerId')), 'count']] ,
        group: ['followingId'],
        order: [[sequelize.col('count'), 'DESC']],
        limit: 10,
        include: [{ model: User, as: 'following', attributes: ['name', 'avatar', 'account'] }],
      })
  
      const userFollowingList = await Followship.findAll({
        where: { followerId: { [Op.eq]: userId } }
      })
  
      res.json({ topTwitters, userFollowingList })
    }
    catch (error) {
      console.log(error)
    }
  },

  getTweet: async (req, res) => {
    const tweetId = req.params.id
    try {
      const tweetData = await Tweet.findByPk(tweetId, {
        include: [
          { model: User, as: 'user', attributes: ['name', 'account', 'avatar'] },
          { model: Reply, as: 'replies',
            include: [{ model: User, as: 'user', attributes: { exclude: ['password', 'email', 'introduction', 'cover', 'createdAt', 'updatedAt'] } }]
          },
          { model: Like, as: 'likes', attributes: ['id'] },
        ]
      })
      return res.json(tweetData)
    }
    catch (error) {
      console.log(error)
    }
  },

  postTweet: async (req, res) => {
    try {
      const data = {}
      data.UserId = req.user.id
      data.description = req.body.description
      const tweet = await Tweet.create({ ...data })
      tweet.user = req.user
      tweet.type = 'new-tweet'
      const tweetJson = JSON.stringify(tweet)

      // 取出訂閱該使用者的清單
      const subscribers = await Subscribe.findAll({
        raw: true,
        where: { subscribing: { [Op.eq]: req.user.id }},
        attributes: ['subscriber']
      })

      const unreadUpdates = subscribers.map(element => {
        return {
          sendId: req.user.id,
          receiveId: element.subscriber,
          unread: tweetJson
        }
      });

      // 批次建立未讀資料進資料庫
      await Unread.bulkCreate(unreadUpdates)

      const io = req.app.get('socketio')

      // 對訂閱者發送通知
      subscribers.map(element => {
        const roomId = 's' + element.subscriber
        console.log("🚀 ~ file: tweetController.js ~ line 111 ~ postTweet: ~ roomId", roomId)
        io.join(roomId)
        io.broadcast.to(roomId).emit('notices', 1)
      });

      return res.status(200).json({ tweet })
    }
    catch (error) {
      console.log(error)
      return res.status(404)
    }
  },

  postTweetReply: async(req, res) => {
    try {
      const data = {}
      data.UserId = req.user.id
      data.TweetId = req.params.id
      data.comment = req.body.comment
      const tweetComment = await Reply.create({ ...data })

      // 針對即時訊息做處理
      const twitterId = Tweet.findByPk(TweetId, { raw: true, attributes: ['UserId'] })
      tweetComment.user = req.user
      tweetComment.type = 'tweet-reply'
      const tweetCommentContent = JSON.stringify(tweetComment)
      await Unread.create({
        sendId: req.user.id,
        receiveId: twitterId,
        unread: tweetCommentContent
      })
      return res.status(200).json({ tweetComment })
    }
    catch (error) {
      console.log(error)
      return res.status(404)
    }
  },

  postLike: async (req, res) => {
    try {
      UserId = req.user.id
      TweetId = Number(req.params.id)
      const like = await Like.findOrCreate({ where: { UserId, TweetId } })

      // 針對即時訊息做處理
      const twitterId = Tweet.findByPk(TweetId, { attributes: ['UserId'] })
      const unread = {}
      unread.type = 'tweet-like'
      unread.user = req.user
      const unreadContent = JSON.stringify(unread)
      await Unread.create({
        sendId: req.user.id,
        receiveId: twitterId,
        unread: unreadContent
      })

      return res.status(200).json({ like })
    }
    catch (error) {
      console.log(error)
      return res.status(404)
    }
  },

  postUnlike: async (req, res) => {
    try {
      const TweetId = Number(req.params.id)
      const unlike = await Like.findOne({ where: { TweetId: { [Op.eq]: TweetId } } })
      if (unlike) {
        await unlike.destroy()
        return res.status(200).json('Accept')
      } else {
        return res.status(404)
      }
    }
    catch (error) {
      console.log(error)
      return res.status(404)
    }
  },

  getTweetReplies: async (req, res) => {
    try {
      const tweetId = Number(req.params.id)
      const replies = await Reply.findAll({ 
        where: { TweetId: { [Op.eq]: tweetId } },
        include: [{ model: User, as: 'user', attributes: ['avatar', 'account', 'name'] }]
      })
      res.json(replies)
    }
    catch (error) {
      console.log(error)
      return res.status(404)
    }
  }
}


module.exports = tweetController