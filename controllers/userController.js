const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const Room = db.Room
const bcrypt = require('bcryptjs')
// JWT
const jwt = require('jsonwebtoken')

const { ImgurClient } = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signIn: (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({ ststus: 'error', message: '請輸入 email 與密碼' })
    }

    User.findOne({ where: { email: email }, include: [{ model: User, as: 'Followers' }, { model: User, as: 'Followings' }, Like, { model: User, as: 'NotiObjs' }] })
      .then(user => {
        if (!user) {
          return res.status(401).json({ ststus: 'error', message: '此 email 尚未註冊' })
        }
        if (user.role !== 'user') {
          return res.status(401).json({ status: 'error', message: '不存在此 user 一般使用者' })
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ ststus: 'error', message: '密碼錯誤' })
        }

        user = {
          account: user.account,
          avatar: user.avatar,
          id: user.id,
          email: user.email,
          introduction: user.introduction,
          name: user.name,
          role: user.role,
          banner: user.banner,
          Followers: user.Followers.map(follower => follower.Followship.followerId),
          Followings: user.Followings.map(following => following.Followship.followingId),
          userLikesId: user.Likes.map(like => like.TweetId),
          NotiObjs: user.NotiObjs.map(notiObj => notiObj.Notify.notiObj)
        }

        // 簽發token
        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret')
        // 回傳訊息、token、user data
        return res.json({
          status: 'success',
          message: '登入驗證成功',
          token: token,
          user: user
        })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
      })
  },
  signUp: (req, res) => {
    // 取得前端表單資料
    const { account, name, email, password, checkPassword } = req.body

    // 表單資料有缺漏，或是password, checkPassword 不一致時，return
    if (!account || !name || !email || !password || !checkPassword) {
      return res.status(401).json({ status: 'error', message: 'account, name, email, password, checkPassword 均需填寫' })
    }
    if (password !== checkPassword) {
      return res.status(401).json({ status: 'error', message: 'password, checkPassword 不一致' })
    }

    // 檢查輸入之 account, email是否已經被註冊過
    const errorMessages = []
    User.findOne({ where: { email: email } })
      .then(user => {
        if (user) {
          errorMessages.push('此 email 已經註冊')
        }
        User.findOne({ where: { account: account } })
          .then(user => {
            if (user) {
              errorMessages.push('此 account 已經註冊')
            }

            // 如果輸入之 account, email，其中有一已經被註冊過，return
            if (errorMessages.length > 0) {
              return res.status(401).json({ status: 'error', errorMessages: errorMessages })
            }

            // 無誤時，建立新的資用者資料到資料庫中
            User.create({
              account: account,
              name: name,
              email: email,
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
              role: 'user'
            })
              .then(user => {
                return res.json({ status: 'success', message: '' })
              })
          })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', errorMessages: [] })
      })
  },
  getUser: (req, res) => {
    // 目前前端 fetchUser 拉出 user資料，似無使用到 Like, Reply 相關資料，先註解起來降低後端工作量
    // User.findByPk(req.params.id, { include: [Like, Reply, { model: User, as: 'Followers' }, { model: User, as: 'Followings' }] })
    User.findByPk(req.params.id, { include: [{ model: User, as: 'Followers' }, { model: User, as: 'Followings' }] })
      .then(user => {
        // 讓一般使用者，無法撈到 admin 管理者的資訊
        if (user.role === 'admin' && req.user.role !== 'admin') {
          return res.status(404).json({ status: 'error', message: 'not-found', error: error })
        }

        // 每次撈出資料後，順便檢視、更新 followersNum
        user.update({
          // likesNum: user.Likes.length + 999,
          // repliesNum: user.Replies.length,
          followersNum: user.Followers.length
        })
          .then(user => {
            user = {
              account: user.account,
              avatar: user.avatar,
              id: user.id,
              email: user.email,
              introduction: user.introduction,
              name: user.name,
              role: user.role,
              banner: user.banner,
              Followers: user.Followers.map(follower => follower.Followship.followerId),
              Followings: user.Followings.map(following => following.Followship.followingId),
              tweetsNum: user.tweetsNum,
              likesNum: user.likesNum,
              repliesNum: user.repliesNum
            }
            return res.json(user)
          })
      })
      .catch(error => {
        return res.status(404).json({ status: 'error', message: 'not-found', error: error })
      })
  },
  getCurrentUser: (req, res) => {
    // JWT驗證後從資料庫撈出的 req.user
    // 這邊的資料屬性要和 /config/passport.js 定義的一致
    return res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      account: req.user.account,
      avatar: req.user.avatar,
      banner: req.user.banner,
      introduction: req.user.introduction,
      role: req.user.role,
      Followers: req.user.Followers,
      Followings: req.user.Followings,
      userLikesId: req.user.userLikesId,
      NotiObjs: req.user.NotiObjs
    })
  },
  getUserTweets: (req, res) => {
    const userId = req.params.id
    const offset = Number(req.query.tweetsOffset) || 0
    Tweet.findAll({ offset: offset, limit: 10, where: { UserId: userId }, include: [User, Like, Reply], order: [['createdAt', 'DESC']] })
      .then(tweets => {
        tweets = { tweets: tweets }
        tweets = JSON.stringify(tweets)
        tweets = JSON.parse(tweets)
        tweets = tweets.tweets.map(tweet => ({
          ...tweet,
          likesLength: tweet.Likes.length,
          repliesLength: tweet.Replies.length,
          User: {
            account: tweet.User.account,
            avatar: tweet.User.avatar,
            id: tweet.User.id,
            introduction: tweet.User.introduction,
            name: tweet.User.name,
            role: tweet.User.role,
            banner: tweet.User.banner
          }
        }))

        // 每次撈出資料後，順便檢視、更新 User tweetsNum
        User.findByPk(userId)
          .then(user => {
            user.update({
              tweetsNum: tweets.length
            })
              .then(() => {
                if (tweets.length !== 0) {
                  return res.json(tweets)
                } else {
                  return res.json('loadToEnd')
                }
              })
          })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
      })
  },
  getUserRepliedTweets: (req, res) => {
    const userId = req.params.id
    const offset = Number(req.query.repliesOffset) || 0
    Reply.findAll({ offset: offset, limit: 10, where: { UserId: userId }, include: [User, { model: Tweet, include: [User] }], order: [['createdAt', 'DESC']], raw: true, nest: true })
      .then(replies => {
        replies = replies.map(reply => ({
          id: reply.id,
          UserId: reply.UserId,
          TweetId: reply.TweetId,
          comment: reply.comment,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
          User: {
            account: reply.User.account,
            avatar: reply.User.avatar,
            id: reply.User.id,
            name: reply.User.name
          },
          Tweet: {
            id: reply.Tweet.id,
            UserId: reply.Tweet.UserId,
            description: reply.Tweet.description,
            createdAt: reply.Tweet.createdAt,
            updatedAt: reply.Tweet.updatedAt,
            User: {
              account: reply.Tweet.User.account,
              avatar: reply.Tweet.User.avatar,
              id: reply.Tweet.User.id,
              name: reply.Tweet.User.name
            }
          }
        }))

        // 每次撈出資料後，順便檢視、更新 User repliesNum
        User.findByPk(userId)
          .then(user => {
            user.update({
              repliesNum: replies.length
            })
              .then(() => {
                if (replies.length !== 0) {
                  return res.json(replies)
                } else {
                  return res.json('loadToEnd')
                }
              })
          })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
      })
  },
  getUserLikes: (req, res) => {
    const userId = req.params.id
    const offset = Number(req.query.likesOffset) || 0
    Like.findAll({ offset: offset, limit: 10, where: { UserId: userId }, include: [{ model: Tweet, include: [User, Reply, Like] }], order: [['createdAt', 'DESC']] })
      .then(likes => {
        likes = likes.map(like => ({
          id: like.id,
          UserId: like.UserId,
          TweetId: like.TweetId,
          createdAt: like.createdAt,
          updatedAt: like.updatedAt,
          Tweet: {
            id: like.Tweet.id,
            UserId: like.Tweet.UserId,
            description: like.Tweet.description,
            createdAt: like.Tweet.createdAt,
            updatedAt: like.Tweet.updatedAt,
            User: {
              id: like.Tweet.User.id,
              account: like.Tweet.User.account,
              avatar: like.Tweet.User.avatar,
              name: like.Tweet.User.name
            },
            Replies: like.Tweet.Replies,
            Likes: like.Tweet.Likes,
            likesLength: like.Tweet.Likes.length,
            repliesLength: like.Tweet.Replies.length
          }
        }))
        // 每次撈出資料後，順便檢視、更新 User likesNum
        User.findByPk(userId)
          .then(user => {
            user.update({
              likesNum: likes.length
            })
              .then(() => {
                if (likes.length !== 0) {
                  return res.json(likes)
                } else {
                  return res.json('loadToEnd')
                }
              })
          })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
      })
  },
  getUserFollowings: (req, res) => {
    const userId = req.params.id
    Followship.findAll({ where: { followerId: userId }, order: [['createdAt', 'DESC']] })
      .then(followings => {
        followings = { followings: followings }
        followings = JSON.stringify(followings)
        followings = JSON.parse(followings)
        followings = followings.followings.map(following => following)
        Promise.all(followings.map(following => {
          return User.findByPk(following.followingId)
        }))
          .then((users) => {
            users = { users: users }
            users = JSON.stringify(users)
            users = JSON.parse(users)
            users = users.users.map(user => ({
              account: user.account,
              avatar: user.avatar,
              id: user.id,
              introduction: user.introduction,
              name: user.name
            }))
            followings.forEach((following, index) => {
              following.followingUser = users[index]
            })
            return res.json(followings)
          })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
      })
  },
  getUserFollowers: (req, res) => {
    const userId = req.params.id
    Followship.findAll({ where: { followingId: userId }, order: [['createdAt', 'DESC']] })
      .then(followers => {
        followers = { followers: followers }
        followers = JSON.stringify(followers)
        followers = JSON.parse(followers)
        followers = followers.followers.map(follower => follower)
        Promise.all(followers.map(follower => {
          return User.findByPk(follower.followerId)
        }))
          .then((users) => {
            users = { users: users }
            users = JSON.stringify(users)
            users = JSON.parse(users)
            users = users.users.map(user => ({
              account: user.account,
              avatar: user.avatar,
              id: user.id,
              introduction: user.introduction,
              name: user.name
            }))
            followers.forEach((follower, index) => {
              follower.followerUser = users[index]
            })
            return res.json(followers)
          })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
      })
  },
  async putUser(req, res, done) {
    try {
      // user name、introduction 會在 body 內；avatar、banner 在 files 內
      const userId = req.user.id

      // user.name 不可更新為空白，如傳入資料為空白，則結束函式
      if (!req.body.name) {
        return res.status(401).json({ status: 'error', message: 'Name 不可為空白' })
      }

      // 檢查輸入之 name 是否已經被使用過
      const nameHasBeenUsed = await User.findOne({ where: { name: req.body.name } })
        .then(user => {
          if (user) {
            // email 已有人此用，且該人並不是 currentUser
            if (user.id !== userId) {
              return true
            } else {
              return false
            }
          }
        })
      if (nameHasBeenUsed) {
        return res.status(401).json({ status: 'error', message: '此 name 已經有其他使用者使用' })
      }

      // 如果有傳圖檔的話
      if (req.files) {
        // 傳送 avatar、banner 檔案給 imgur，可以兩個都有、一有一無，或兩個都沒有
        Promise.all(req.files.map(async (file) => {
          const encode_image = file.buffer.toString('base64')
          const client = new ImgurClient({ clientId: IMGUR_CLIENT_ID })

          // 傳 encode_image 給 imgur
          const response = await client.upload({
            image: encode_image,
            type: 'base64'
          })

          // 整理 imgur 回傳的圖片連結，存到 imgurLink
          const result = {
            'originalname': file.originalname,
            'imgurLink': response.data.link
          }
          return result
          // return done(null, result)
        }))
          .then((results) => {
            const name = req.body.name
            const introduction = req.body.introduction
            let avatar = undefined
            let banner = undefined

            // 如果有更新 avatar 或 banner，則 results 至少會有一個物件，將該物件中的 imgurLink 存到變數 avatar 或 banner 中，等等再更新到資料庫內
            if (results.length > 0) {
              results.forEach(result => {
                if (result.originalname === 'avatar') {
                  avatar = result.imgurLink
                } else if (result.originalname === 'banner') {
                  banner = result.imgurLink
                }
              })
            }

            // 如果使用者在前端 cancel banner，此時 req.body.banner 會回傳 default banner URL
            if (req.body.banner) {
              if (req.body.banner.length > 0 || typeof req.body.banner === 'string') {
                banner = req.body.banner
              }
            }

            // 更新到資料庫
            User.findByPk(req.user.id)
              .then(user => {
                user.update({
                  ...user,
                  name: name,
                  introduction: introduction,
                  avatar: avatar,
                  banner: banner
                })
                  .then(() => {
                    return res.json({ status: 'success', results: results })
                  })
              })
              .catch(error => {
                return res.status(401).json({ status: 'error', error: error })
              })
          })
      } else {
        // 如果沒有傳圖檔，單純更新 name 或 introduction
        const name = req.body.name
        const introduction = req.body.introduction
        let banner = ''

        if (req.body.banner) {
          if (req.body.banner.length > 0 || typeof req.body.banner === 'string') {
            banner = req.body.banner
          }
        }

        // 更新到資料庫
        User.findByPk(req.user.id)
          .then(user => {
            user.update({
              ...user,
              name: name,
              introduction: introduction,
              banner: banner !== '' ? banner : user.banner
            })
              .then(() => {
                return res.json({ status: 'success' })
              })
          })
          .catch(error => {
            return res.status(401).json({ status: 'error', error: error })
          })
      }
    } catch (error) {
      console.warn(error)
    }
  },
  putSetting: (req, res) => {
    return res.json({ status: 'error', message: '更改「帳戶設定」功能，暫時關閉' })
    // const userId = req.user.id
    // const { name, introduction, email, account, checkPassword } = req.body
    // let { password } = req.body
    // if (!name || !email || !account) {
    //   return res.status(401).json({ status: 'error', message: 'Name、Email、Account 不可為空白' })
    // }
    // if (password !== checkPassword) {
    //   return res.status(401).json({ status: 'error', message: 'password, checkPassword 不一致' })
    // }
    // if (password) {
    //   password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    // } else {
    //   password = ''
    // }

    // // 檢查輸入之 account, email, name 是否已經被使用了
    // const errorMessages = []
    // User.findOne({ where: { email: email } })
    //   .then(user => {
    //     if (user) {
    //       // email 已有人此用，且該人並不是 currentUser
    //       if (user.id !== userId) {
    //         errorMessages.push('此 email 已經有其他使用者使用')
    //       }
    //     }

    //     User.findOne({ where: { account: account } })
    //       .then(user => {
    //         if (user) {
    //           // account 已有人此用，且該人並不是 currentUser
    //           if (user.id !== userId) {
    //             errorMessages.push('此 account 已經有其他使用者使用')
    //           }
    //         }

    //         User.findOne({ where: { name: name } })
    //           .then(user => {
    //             if (user) {
    //               // account 已有人此用，且該人並不是 currentUser
    //               if (user.id !== userId) {
    //                 errorMessages.push('此 name 已經有其他使用者使用')
    //               }
    //             }

    //             // 如果輸入之 account, email，其中有一已經被其他人使用了，return
    //             if (errorMessages.length > 0) {
    //               return res.status(401).json({ status: 'error', errorMessages: errorMessages })
    //             }

    //             // 無誤時，建立新的資用者資料到資料庫中
    //             User.findByPk(userId, { include: [{ model: User, as: 'Followers' }, { model: User, as: 'Followings' }] })
    //               .then(user => {
    //                 user.update({
    //                   name: name || user.name,
    //                   introduction: introduction || user.introduction,
    //                   email: email || user.email,
    //                   account: account || user.account,
    //                   password: password || user.password
    //                 })
    //                   .then(user => {
    //                     user = {
    //                       account: user.account,
    //                       avatar: user.avatar,
    //                       id: user.id,
    //                       email: user.email,
    //                       introduction: user.introduction,
    //                       name: user.name,
    //                       role: user.role,
    //                       banner: user.banner,
    //                       Followers: user.Followers.map(follower => follower.Followship.followerId),
    //                       Followings: user.Followings.map(following => following.Followship.followingId)
    //                     }
    //                     return res.json(user)
    //                   })
    //               })
    //           })
    //       })
    //   })
    //   .catch(error => {
    //     return res.status(401).json({ status: 'error', errorMessages: [] })
    //   })
  }
}

module.exports = userController
