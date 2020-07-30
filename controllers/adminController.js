const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const helpers = require('../_helpers.js')
const { Op } = require("sequelize")

const adminController = {
  getAllUsers: (req, res) => {
    return User.findAll({
      raw: true,
      nest: true,
      // 排除 admin 資料；即使有多個 admin 也能過濾
      where: { [Op.not]: { role: "1" } }
    })
      .then(users => {
        if (!users.length) {
          return res.json({ status: 'success', message: '尚未有使用者註冊', users })
        }

        const usersData = users.map(user => {
          user.status = 'success'
          user.message = '找到使用者'
          user.isAdmin = Boolean(Number(user.role))
          delete user.role
          delete user.password

          return user
        })

        res.json([...usersData])
      })
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  },

  getAllTweets: (req, res) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User]
    })
      .then(tweets => {
        // tweets 為空陣列 => 找不到 tweets
        if (!tweets.length) {
          return res.json({ status: 'success', message: '還沒有任何人建立推文' })
        }

        const tweetsData = tweets.map(tweet => {
          tweet.status = 'success'
          tweet.message = '找到推文'
          tweet.User.isAdmin = Boolean(Number(tweet.User.role))
          delete tweet.User.role
          delete tweet.User.password

          return tweet
        })

        res.json([...tweetsData])
      })
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  },

  deleteTweet: (req, res) => {
    const getLikedTweetUsers = (TweetId) => {
      return Like.findAll({
        raw: true,
        nest: true,
        where: { TweetId }
      })
    }

    const tweetId = req.params.tweet_id

    return Tweet.findByPk(tweetId)
      .then(async (tweet) => {
        // 找不到 tweet => 報錯
        if (!tweet) {
          return res.json({ status: 'error', message: '推文不存在，無法刪除' })
        } else {
          const likedTweetUsers = getLikedTweetUsers(tweetId)

          // 刪除 Tweet
          // 連同刪除 Reply
          // 更新 User.tweetCount
          // 刪除 User.like
          // 更新 User.likeCount
          await Promise.all([
            tweet.destroy(),
            Reply.destroy({ where: { TweetId: tweetId } }),
            User.decrement('tweetCount', { by: 1, where: { id: tweet.UserId } }),
            likedTweetUsers.map(like => Like.destroy({ where: { UserId: like.UserId, TweetId: like.TweetId } })),
            likedTweetUsers.map(like => User.decrement('likeCount', { by: 1, where: { id: like.UserId } }))
          ])
            .then(results => {
              return res.json({ status: 'success', message: 'admin 成功刪除一則推文' })
            })
        }
      })
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  }
}

module.exports = adminController