const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const helpers = require('../_helpers.js')
const { Op } = require("sequelize")

const adminController = {
  getAllUsers: (req, res) => {
    return User.findAll({
      raw: true,
      nest: true,
      // 不顯示 admin 資料；即使有多個 admin 也能過濾
      where: { [Op.not]: { role: "1" } }
    })
      .then(users => {
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
          return res.json({ status: 'error', message: '還沒有任何人建立推文' })
        } else {
          const tweetsData = tweets.map(tweet => {
            tweet.status = 'success'
            tweet.message = '找到推文'
            tweet.User.isAdmin = Boolean(Number(tweet.User.role))
            delete tweet.User.role
            delete tweet.User.password

            return tweet
          })

          res.json([...tweetsData])
        }
      })
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  },

  deleteTweet: (req, res) => {
    const tweetId = req.params.tweet_id

    return Tweet.findByPk(tweetId)
      .then(tweet => {
        // 找不到 tweet => 報錯
        if (!tweet) {
          return res.json({ status: 'error', message: '推文不存在，無法刪除' })
        } else {
          return tweet.destroy()
            .then(tweet => {
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