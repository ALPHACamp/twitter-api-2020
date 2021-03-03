const { User, Tweet, Reply, sequelize } = require('../models')
const formatDistanceToNow = require('date-fns/formatDistanceToNow')
const helpers = require('../_helpers')
const includeCountData = (req) => {
  return [
    [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
    [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
    [sequelize.literal(`EXISTS(SELECT * FROM LIKES WHERE LIKES.UserId = ${helpers.getUser(req).id} AND LIKES.TweetId = Tweet.id)`), 'isLiked']
  ]
}
const includeUserData = () => ({ model: User, attributes: ['id', 'name', 'account', 'avatar'] })

const tweetController = {
  // 瀏覽全部推文
  getTweets: (req, res) => {
    return Tweet.findAll({
      include: includeUserData(), // 使用者資料
      attributes: {
        // 計算數量
        include: includeCountData(req),
        // 過濾不要資料
        exclude: ['updatedAt']
      },
      raw: true,
      nest: true,
      order: [
        // 資料庫端進行排列
        [sequelize.literal('createdAt'), 'DESC']
      ]
    }).then(tweets => {
      const data = tweets.map(r => ({
        ...r,
        time: formatDistanceToNow(r.createdAt, { includeSeconds: true })
      }))
      return res.status(200).json(data)
    }).catch(error => console.error(error))
  },
  // 瀏覽單一推文
  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        User,
        Reply,
        includeUserData() // 使用者資料
      ],
      attributes: {
        // // 計算數量
        include: includeCountData(req),
        // 過濾不要資料
        exclude: ['updatedAt']
      },
      raw: true,
      nest: true
    }).then(tweets => {
      // 留言內回覆者時間建立
      tweets.Replies.replyTime = formatDistanceToNow(tweets.Replies.createdAt, { includeSeconds: true })
      return res.json(tweets)
    }).catch(error => console.error(error))
  },
  postTweet: (req, res) => {
    return Tweet.create({
      description: req.body.description,
      UserId: helpers.getUser(req).id
    })
      .then((category) => {
        return res.status(200).json({ status: 'success', message: 'Tweet was successfully created' })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', message: '個人資料-伺服器錯誤請稍後', error })
      })
  },
  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then(async (tweet) => {
        await tweet.destroy()
        return res.status(200).json({ status: 'success', message: 'Tweet was successfully deleted' })
      })
      .catch(error => console.error(error))
  },

  putTweet: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        tweet.update(req.body)
          .then((category) => {
            return res.status(200).json({ status: 'success', message: 'category was successfully to update', data: req.body })
          })
      })
      .catch(error => console.error(error))
  }

}
module.exports = tweetController
