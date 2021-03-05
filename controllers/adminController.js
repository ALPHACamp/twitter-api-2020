const { User, Tweet, Reply, Like, sequelize, Followship } = require('../models')
const helpers = require('../_helpers')

const adminController = {
  getTweets: async (req, res) => {
    return Tweet.findAll({
      include: [{
        model: User,
      }],
      attributes: {
        // 資料庫端運行計算
        include: [
          //看UI是沒有，先保留
          // [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
          // [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount']
        ]
      },
      limit: 2,
      raw: true,
      nest: true,
      order: [
        // 資料庫端進行排列
        [sequelize.literal('createdAt'), 'DESC']
      ]
    }).then(tweets => {

      const data = tweets.map(tweet => ({
        ...tweet,
        // 可以直接在清單上快覽 Tweet 的前 50 個字
        description: tweet.description.substring(0, 50),
      }))
      return res.status(200).json(data)
    }).catch(error => console.error(error))
  },

  getUsers: (req, res) => {
    return Promise.all([
      User.findAll({
        include: [
          //如果只要數字就下面就都不用
          // { model: Tweet },
          // { model: Reply },
          // { model: Like },
          // { model: User, as: 'Followers' },
          // { model: User, as: 'Followings' },
        ],
        limit: 3,
        attributes: {
          // 資料庫端運行計算
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'), 'FollowerCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'FollowingCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = User.id)'), 'likeCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.UserId = User.id)'), 'replyCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'tweetCount']
          ]
        },
        raw: true,
        nest: true,
        order: [
          // 依推文數進行排列
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'DESC']
        ]
      }),
    ])
      // 在資料庫端計算好 count 在返回
      .then((user) => {
        return res.status(200).json(...user)
      })
      .catch(err => {
        return res.status(500).json({ status: 'error', message: '個人資料-伺服器錯誤請稍後', err })
      })
  },
  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.id)
      .then(async (tweet) => {
        await tweet.destroy()
        return res.json({ status: 'success', message: 'Tweet was successfully deleted' })
      })
      .catch(error => console.error(error))
  },

}
module.exports = adminController


