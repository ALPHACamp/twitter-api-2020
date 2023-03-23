const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply
const bcrypt = require('bcryptjs')
// JWT
const jwt = require('jsonwebtoken')

const adminController = {
  signIn: (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({ ststus: 'error', message: '請輸入 email 與密碼' })
    }

    User.findOne({ where: { email: email } })
      .then(user => {
        if (!user || user.role === 'user') {
          return res.status(401).json({ status: 'error', message: '不存在此 admin 管理者' })
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ ststus: 'error', message: '密碼錯誤' })
        }

        // 簽發 token
        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret')
        return res.json({
          status: 'success',
          message: '登入驗證成功',
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            account: user.account,
            avatat: user.avatat,
            introduction: user.introduction,
            role: user.role,
            banner: user.banner
          }
        })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
      })
  },
  getUsers: (req, res) => {
    User.findAll({
      include: [{ model: User, as: 'Followers' }, { model: User, as: 'Followings' }],
      order: [['tweetsNum', 'DESC']]
    })
      .then(users => {
        users = { users: users }
        users = JSON.stringify(users)
        users = JSON.parse(users)
        users = users.users.map(user => ({
          account: user.account,
          avatar: user.avatar,
          id: user.id,
          introduction: user.introduction,
          name: user.name,
          role: user.role,
          banner: user.banner,
          tweetsNum: user.tweetsNum,
          repliesNum: user.repliesNum,
          likesNum: user.likesNum,
          followers: user.Followers.length,
          followings: user.Followings.length
        }))
        return res.json(users)
      })
      .catch(error => {
        return res.status(404).json({ status: 'error', message: 'not-found', error: error })
      })
  },
  getTweets: (req, res) => {
    Tweet.findAll({ include: [User] })
      .then(tweets => {
        tweets = { tweets: tweets }
        tweets = JSON.stringify(tweets)
        tweets = JSON.parse(tweets)
        tweets = tweets.tweets.map(tweet => ({
          ...tweet,
          User: {
            account: tweet.User.account,
            avatar: tweet.User.avatar,
            id: tweet.User.id,
            name: tweet.User.name
          }
        }))
        return res.json(tweets)
      })
      .catch(error => {
        return res.status(404).json({ status: 'error', message: 'not-found', error: error })
      })
  },
  // async deleteTweet(req, res) {
  //   // 改成 async await 寫法，但好像只 call database 去 destroy 資料，還沒等到 database 回傳執行結果，就 return 結果給前端了
  //   try {
  //     const tweet = await Tweet.findByPk(req.params.id, { include: [Reply, Like] })
  //     const likes = await Promise.all(tweet.Likes.map(like => {
  //       return Like.findByPk(like.id)
  //         .then(like => {
  //           like.destroy()
  //         })
  //     }))
  //     const replies = await Promise.all(tweet.Replies.map(reply => {
  //       return Reply.findByPk(reply.id)
  //         .then(reply => {
  //           reply.destroy()
  //         })
  //     }))
  //     tweet.destroy()
  //     .then(() => {
  //       return res.json({ status: 'success', message: '' })
  //     })
  //   } catch (error) {
  //     console.warn(error)
  //   }
  // },
  deleteTweet: (req, res) => {
    // 刪除 Tweet 相關的 likes、replies，通過測試檔
    // 層層下去，確實等到 database 都執行完畢，才 return 結果給前端
    Tweet.findByPk(req.params.id, { include: [Reply, Like] })
      .then(tweet => {
        Promise.all(tweet.Likes.map(like => {
          return Like.findByPk(like.id)
            .then(like => {
              like.destroy()
            })
        }))
          .then(() => {
            Promise.all(tweet.Replies.map(reply => {
              return Reply.findByPk(reply.id)
                .then(reply => {
                  reply.destroy()
                })
            }))
              .then(() => {
                tweet.destroy()
                  .then(() => {
                    return res.json({ status: 'success', message: '' })
                  })
              })
          })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
      })
  },
  // 重新計算每個 User 有幾個 tweets、replies、likes，並把數字更新到 User
  // 資料龐大時應不該如此使用
  // 在 userController.js 的 getUserTweets、getUserLikes、getUserRepliedTweets 有設定每次撈出資料後，順便檢視、更新 tweetsNum likesNum、repliesNum
  recountUserTweetsRepliesLikesNum: (req, res) => {
    User.findAll()
      .then(users => {
        users = { users: users }
        users = JSON.stringify(users)
        users = JSON.parse(users)
        users = users.users.map(user => ({
          ...user
        }))

        Promise.all(users.map(user => {
          return User.findByPk(user.id, { include: [Tweet, Reply, Like] })
            .then(user => {
              let tweetsNum = 0
              let repliesNum = 0
              let likesNum = 0
              if (user.Tweets) {
                tweetsNum = user.Tweets.length
              }
              if (user.Replies) {
                repliesNum = user.Replies.length
              }
              if (user.Likes) {
                likesNum = user.Likes.length
              }
              user.update({
                tweetsNum: tweetsNum,
                repliesNum: repliesNum,
                likesNum: likesNum
              })
            })
        }))
          .then((users) => {
            return res.json({ status: 'success', message: '' })
          })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
      })
  },
  // 重新計算每個 User 有幾個 followers，並把數字更新到 User.followersNum
  // 資料龐大時應不該如此使用
  // 在 userController.js 的 getUser 有設定每次撈出資料後，順便檢視、更新 followersNum
  recountUserFollowersNum: (req, res) => {
    User.findAll()
      .then(users => {
        users = { users: users }
        users = JSON.stringify(users)
        users = JSON.parse(users)
        users = users.users.map(user => ({
          account: user.account,
          avatar: user.avatar,
          id: user.id,
          introduction: user.introduction,
          name: user.name,
          role: user.role,
          banner: user.banner
        }))

        Promise.all(users.map(user => {
          return User.findByPk(user.id, { include: [{ model: User, as: 'Followers' }] })
            .then(user => {
              let followersNum = 0
              if (user.Followers) {
                followersNum = user.Followers.length
              }
              user.update({
                followersNum: followersNum
              })
            })
        }))
          .then((users) => {
            return res.json({ status: 'success', message: '' })
          })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
      })
  }
}

module.exports = adminController
