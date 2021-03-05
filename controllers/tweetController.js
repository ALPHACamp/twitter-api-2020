const { User, Tweet, Reply, Like, sequelize } = require('../models')
const formatDistanceToNow = require('date-fns/formatDistanceToNow')
const helpers = require('../_helpers')
// 重複程式碼 
const includeCountData = (req) => {
  return [
    [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
    [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
  ]
}
const includeUserData = () => ({ model: User, attributes: ['id', 'name', 'account', 'avatar'] })

const tweetController = {
  // 瀏覽全部推文
  getTweets: async (req, res) => {
    return Tweet.findAll({
      include: [
        Like,
        includeUserData(), // 使用者資料
      ],
      attributes: {
        // 計算數量
        include: includeCountData(req),
      },
      raw: true,
      nest: true,
      // 資料庫端進行排列
      order: [[sequelize.literal('createdAt'), 'DESC']],
      limit: 10
    }).then(tweets => {
      const set = new Set()
      const tweetsFilter = tweets.filter(item => !set.has(item.id) ? set.add(item.id) : false)
      // 建立推文時間距離多久
      const data = tweetsFilter.map(r => ({
        ...r,
        time: formatDistanceToNow(r.createdAt, { includeSeconds: true }),
        isLiked: r.Likes.UserId === req.user.id
      }))
      return res.status(200).json(data)
    }).catch(error => {
      return res.status(500).json({ status: 'error', message: '瀏覽全部推文-伺服器錯誤請稍後', error })
    })
  },
  // 瀏覽單一推文
  getTweet: async (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        User
      ],
      attributes: {
        // // 計算數量
        include: includeCountData(req),        
        // 過濾不要資料
        exclude: ['updatedAt']
      }
    }).then(tweets => {
      const data = tweets.toJSON()
      data.isLiked = tweets.UserId === req.user.id
      return res.status(200).json(data)
    }).catch(error => {
      return res.status(500).json({ status: 'error', message: '瀏覽單一推文-伺服器錯誤請稍後', error })
    })
  },
  // 新增推特
  postTweet: (req, res) => {
    return Tweet.create({
      description: req.body.description,
      UserId: helpers.getUser(req).id
    })
      .then((category) => {
        return res.status(200).json({ status: 'success', message: 'Tweet was successfully created' })
      })
      .catch(error => {
        return res.status(500).json({ status: 'error', message: '編輯推文-伺服器錯誤請稍後', error })
      })
  },
  // 刪除推特
  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then(async (tweet) => {
        await tweet.destroy()
        return res.status(200).json({ status: 'success', message: 'Tweet was successfully deleted' })
      })
      .catch(error => {
        return res.status(500).json({ status: 'error', message: '刪除推特-伺服器錯誤請稍後', error })
      })
  },
  // 修改推特
  putTweet: (req, res) => {
    if (!req.body.description) {
      return res.json({ status: 'error', message: '請輸入推文' })
    }
    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        tweet.update(req.body)
          .then((category) => {
            return res.status(200).json({ status: 'success', message: 'category was successfully to update', data: req.body })
          })
      })
      .catch(error => {
        return res.status(500).json({ status: 'error', message: '修改推特-伺服器錯誤請稍後', error })
      })
  },
  // 新增 Like
  postLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    })
      .then((tweet) => {
        return res.status(200).json({ status: 'success', message: 'like was successfully create' })
      })
      .catch(error => {
        return res.status(500).json({ status: 'error', message: '修改推特-伺服器錯誤請稍後', error })
      })
  },
  // 刪除 Like
  deleteLike: (req, res) => {
    return Like.findOne({
      where: { UserId: helpers.getUser(req).id, TweetId: req.params.id },
    })
      .then(async (like) => {
        await like.destroy()
        return res.json({ status: 'success', message: 'like was successfully deleted' })
      })
      .catch(error => {
        return res.status(500).json({ status: 'error', message: '刪除推特-伺服器錯誤請稍後', error })
      })

  },
  // 瀏覽回覆
  getReplies: async (req, res) => {
    return Reply.findAll({
      where: { TweetId: req.params.tweet_id },
      include: [{
        model: User,
        attributes: ['id', 'name', 'account', 'avatar']
      }],
      raw: true,
      nest: true,
      order: [
        // 資料庫端進行排列
        [sequelize.literal('createdAt'), 'DESC']
      ]
    }).then(replies => {
      // 建立回覆者時間距離多久
      const data = replies.map(replies => ({
        ...replies,
        replyTime: formatDistanceToNow(replies.createdAt, { includeSeconds: true })
      }))
      return res.status(200).json(data)
    }).catch(error => {
      return res.status(500).json({ status: 'error', message: '瀏覽回覆-伺服器錯誤請稍後', error })
    })
  },
  // 新增回覆
  postReply: async (req, res) => {
    return Reply.create({
      comment: req.body.comment,
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweet_id
    })
      .then(reply => {
        return res.json({ status: 'success', message: 'reply was successfully create' })
      })
      .catch(error => {
        return res.status(500).json({ status: 'error', message: '新增回覆-伺服器錯誤請稍後', error })
      })
  }
}
module.exports = tweetController
