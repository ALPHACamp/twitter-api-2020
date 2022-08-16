const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const bcrypt = require('bcryptjs')
// JWT
const jwt = require('jsonwebtoken')
// const passportJWT = require('passport-jwt')
// const ExtractJwt = passportJWT.ExtractJwt
// const JwtStrategy = passportJWT.Strategy

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
        if (user.role !== 'user') {
          return res.status(401).json({ status: 'error', message: '不存在此 user 一般使用者' })
        }
        if (!user) {
          return res.status(401).json({ ststus: 'error', message: '此 email 尚未註冊' })
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
  },
  getUser: (req, res) => {
    User.findByPk(req.params.id, { include: [Like, Reply, { model: User, as: 'Followers' }, { model: User, as: 'Followings' }] })
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
          likesLength: user.Likes.length,
          repliesLength: user.Replies.length
        }
        return res.json(user)
      })
  },
  getCurrentUser: (req, res) => {
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
    Tweet.findAll({ where: { UserId: userId }, include: [User, Like, Reply], order: [['createdAt', 'DESC']] })
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
        return res.json(tweets)
      })
  },
  getUserRepliedTweets: (req, res) => {
    const userId = req.params.id
    Reply.findAll({ where: { UserId: userId }, include: [User, { model: Tweet, include: [User] }], order: [['createdAt', 'DESC']], raw: true, nest: true })
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
        return res.json(replies)
      })
  },
  getUserLikes: (req, res) => {
    const userId = req.params.id
    Like.findAll({ where: { UserId: userId }, include: [{ model: Tweet, include: [User, Reply, Like] }], order: [['createdAt', 'DESC']] })
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
        return res.json(likes)
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
  },
  // putUser: (req, res) => {
  //   const { name, introduction, email, account, checkPassword } = req.body
  //   let { password } = req.body
  //   if (!name || !email || !account) {
  //     return res.status(401).json({ status: 'error', message: 'Name、Email、Account 不可為空白' })
  //   }
  //   if (password !== checkPassword) {
  //     return res.status(401).json({ status: 'error', message: 'password, checkPassword 不一致' })
  //   }
  //   if (password) {
  //     password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
  //   } else {
  //     password = ''
  //   }
  //   User.findByPk(req.params.id, { include: [{ model: User, as: 'Followers' }, { model: User, as: 'Followings' }] })
  //     .then(user => {
  //       user.update({
  //         name: name || user.name,
  //         introduction: introduction || user.introduction,
  //         email: email || user.email,
  //         account: account || user.account,
  //         password: password || user.password
  //       })
  //         .then(user => {
  //           user = {
  //             account: user.account,
  //             avatar: user.avatar,
  //             id: user.id,
  //             email: user.email,
  //             introduction: user.introduction,
  //             name: user.name,
  //             role: user.role,
  //             banner: user.banner,
  //             Followers: user.Followers.map(follower => follower.Followship.followerId),
  //             Followings: user.Followings.map(following => following.Followship.followingId)
  //           }
  //           return res.json(user)
  //         })
  //     })
  // },
  async putUser(req, res) {
    try {
      // user name、introduction 會在 body 內；avatar、banner 在 files 內

      // user.name 不可更新為空白，如傳入資料為空白，則結束函式
      if (!req.body.name) {
        return res.status(401).json({ status: 'error', message: 'Name 不可為空白' })
      }

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
        })
    } catch (error) {
      console.warn(error)
    }
  },
  putSetting: (req, res) => {
    const { name, introduction, email, account, checkPassword } = req.body
    let { password } = req.body
    if (!name || !email || !account) {
      return res.status(401).json({ status: 'error', message: 'Name、Email、Account 不可為空白' })
    }
    if (password !== checkPassword) {
      return res.status(401).json({ status: 'error', message: 'password, checkPassword 不一致' })
    }
    if (password) {
      password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    } else {
      password = ''
    }
    User.findByPk(req.params.id, { include: [{ model: User, as: 'Followers' }, { model: User, as: 'Followings' }] })
      .then(user => {
        user.update({
          name: name || user.name,
          introduction: introduction || user.introduction,
          email: email || user.email,
          account: account || user.account,
          password: password || user.password
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
              Followings: user.Followings.map(following => following.Followship.followingId)
            }
            return res.json(user)
          })
      })
  },
  // async putUserInfo (req, res) {
  //   try {
  //     // user name、introduction 會在 body 內；avatar、banner 在 files 內

  //     // user.name 不可更新為空白，如傳入資料為空白，則結束函式
  //     if (!req.body.name) {
  //       return res.status(401).json({ status: 'error', message: 'Name 不可為空白' })
  //     }

  //     // 傳送 avatar、banner 檔案給 imgur，可以兩個都有、一有一無，或兩個都沒有
  //     Promise.all(req.files.map(async (file) => {
  //       const encode_image = file.buffer.toString('base64')
  //       const client = new ImgurClient({ clientId: IMGUR_CLIENT_ID })

  //       // 傳 encode_image 給 imgur
  //       const response = await client.upload({
  //         image: encode_image,
  //         type: 'base64'
  //       })

  //       // 整理 imgur 回傳的圖片連結，存到 imgurLink
  //       const result = {
  //         'originalname': file.originalname,
  //         'imgurLink': response.data.link
  //       }
  //       return result
  //     }))
  //       .then((results) => {
  //         const name = req.body.name
  //         const introduction = req.body.introduction
  //         let avatar = undefined
  //         let banner = undefined

  //         // 如果有更新 avatar 或 banner，則 results 至少會有一個物件，將該物件中的 imgurLink 存到變數 avatar 或 banner 中，等等再更新到資料庫內
  //         if (results.length > 0) {
  //           results.forEach(result => {
  //             if (result.originalname === 'avatar') {
  //               avatar = result.imgurLink
  //             } else if (result.originalname === 'banner') {
  //               banner = result.imgurLink
  //             }
  //           })
  //         }

  //         // 如果使用者在前端 cancel banner，此時 req.body.banner 會回傳 default banner URL
  //         if (req.body.banner) {
  //           if (req.body.banner.length > 0 || typeof req.body.banner === 'string') {
  //             banner = req.body.banner
  //           }
  //         }

  //         // 更新到資料庫
  //         User.findByPk(req.user.id)
  //           .then(user => {
  //             user.update({
  //               ...user,
  //               name: name,
  //               introduction: introduction,
  //               avatar: avatar,
  //               banner: banner
  //             })
  //               .then(() => {
  //                 return res.json({ status: 'success', results: results })
  //               })
  //           })
  //       })
  //   } catch (error) {
  //     console.warn(error)
  //   }
  // }
}

module.exports = userController
