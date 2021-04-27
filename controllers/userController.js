const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const helpers = require('../_helpers')

const moment = require('moment')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const imgur = require('imgur-node-api')
const sequelize = require('sequelize')

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const defaultAvatar = 'https://i.imgur.com/OFjWJfj.jpg'
const defaultCover = 'https://i.imgur.com/QznpNwS.jpeg'

const uploadImg = path => {
  return new Promise((resolve, reject) => {
    imgur.upload(path, (err, img) => {
      if (err) return reject(err)
      return resolve(img)
    })
  })
}

const userController = {
  // 登入
  login: async (req, res, next) => {
    try {
      const { account, password } = req.body
      // check account & password required
      if (!account || !password) {
        return res.json({ status: 'error', message: 'account and password are required!' })
      }
      // check account exists or not
      const user = await User.findOne({ where: { account } })
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'this account has not been registered!' })
      }
      // check user role, must be user
      if (user.role !== 'user') {
        return res.status(401).json({ status: 'error', message: 'you don\'t have authority to login!' })
      }
      // check password correct or not
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'password incorrect!' })
      }
      // get token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          account: user.account,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role
        }
      })
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  // 註冊
  register: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      // check account & name & email & password & confirmPassword are required
      if (!account || !name || !email || !password || !checkPassword) {
        return res.json({ status: 'error', message: 'account, name, email, password, checkPassword are required!' })
      }
      // check password & checkPassword are same
      if (password !== checkPassword) {
        return res.json({ status: 'error', message: 'password & checkPassword must be same!' })
      }
      // check email & account have not been used
      const userEmail = await User.findOne({ where: { email } })
      if (userEmail) return res.json({ status: 'error', message: 'this email has been used!' })
      const userAccount = await User.findOne({ where: { account } })
      if (userAccount) return res.json({ status: 'error', message: 'this account has been used!' })
      // create user
      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        role: 'user',
        avatar: defaultAvatar,
        cover: defaultCover
      })
      return res.json({ status: 'success', message: 'register success!' })
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  // 查看單一 user 資料
  // account、name、avatar、cover、推文數量、跟隨中人數、跟隨者人數
  getUser: async (req, res, next) => {
    try {
      let user = await User.findByPk(req.params.id, {
        include: [
          Tweet,
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      })
      if (!user) return res.json({ message: 'can not find this user!' })
      // 整理回傳資料
      user = {
        id: user.id,
        account: user.account,
        name: user.name,
        avatar: user.avatar,
        cover: user.cover,
        introduction: user.introduction,
        tweetCount: user.Tweets.length,
        followingCount: user.Followings.length,
        followerCount: user.Followers.length
      }
      return res.json(user)
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  // 編輯使用者自己的資料 (account、name、email、password、introduction、avatar、cover)
  putUser: async (req, res, next) => {
    try {
      // 只能編輯自己的資料
      const userId = helpers.getUser(req).id
      const id = Number(req.params.id)
      if (userId !== id) return res.json({ status: 'error', message: 'can not edit profile of other users!' })
      const user = await User.findByPk(userId)
      if (!user) return res.json({ status: 'error', message: 'can not find this user!' })
      // 取得編輯資料
      const { account, name, email, password, checkPassword, introduction } = req.body
      // 判斷 password 是否等於 checkPassword
      if (password !== checkPassword) return res.json({ status: 'error', message: 'password & checkPassword must be same!' })
      // check email & account have not been used
      const userEmail = await User.findOne({ where: { email } })
      if (userEmail) return res.json({ status: 'error', message: 'this email has been used!' })
      const userAccount = await User.findOne({ where: { account } })
      if (userAccount) return res.json({ status: 'error', message: 'this account has been used!' })
      // 處理圖片
      const { files } = req
      if (files) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        const imgAvatar = files.avatar ? await uploadImg(files.avatar[0].path) : null
        const imgCover = files.cover ? await uploadImg(files.cover[0].path) : null
        await user.update({
          account: account ? account : user.account,
          name: name ? name : user.name,
          email: email ? email : user.email,
          password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) : user.password,
          introduction: introduction ? introduction : user.introduction,
          avatar: files.avatar ? imgAvatar.data.link : user.avatar,
          cover: files.cover ? imgCover.data.link : user.cover
        })
      } else {
        await user.update({
          account,
          name,
          email,
          password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) : user.password,
          introduction,
          avatar: user.avatar ? user.avatar : defaultAvatar,
          cover: user.cover ? user.cover : defaultCover
        })
      }
      return res.json({ status: 'success', message: 'profile edit success!' })
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  // 查看單一使用者發過的推文
  // 推文的 user部分資料、推文內容、推文的 reply 數、推文的 like 數、推文的發布時間(fromNow)
  getTweets: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) return res.json({ message: 'can not find this user!' })
      let tweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        include: [User, Reply, Like],
        order: [['createdAt', 'DESC']]
      })
      if (tweets.length === 0) return res.json({ message: 'this user has no tweet!' })
      // 整理回傳資料
      tweets = tweets.map(tweet => {
        // 該使用者是否喜歡
        const likesId = []
        tweet.Likes.forEach(like => {
          likesId.push(like.UserId)
        })
        return {
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          fromNow: moment(tweet.createdAt).fromNow(),
          user: {
            id: tweet.User.id,
            name: tweet.User.name,
            account: tweet.User.account,
            avatar: tweet.User.cover
          },
          repliedCount: tweet.Replies.length,
          likedCount: tweet.Likes.length,
          isLiked: likesId.includes(helpers.getUser(req).id)
        }
      })
      return res.json(tweets)
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  // 查看單一使用者發過回覆的推文
  // user 回覆過的推文內容、推文的 user部分資料、推文的 reply、推文的 reply 數、推文的 like 數、推文的發布時間(fromNow)、回覆推文的時間(fromNow)
  getRepliedTweets: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) return res.json({ message: 'this user does not exist!' })
      let replies = await Reply.findAll({
        where: { UserId: req.params.id },
        include: [{ model: Tweet, include: [User, Reply, Like] }],
        order: [['createdAt', 'DESC']]
      })
      if (replies.length === 0) return res.json({ message: 'this user has no reply for any tweet!' })
      // 整理回傳資料
      replies = replies.map(reply => {
        const tweet = reply.Tweet
        // 該使用者是否喜歡
        const likesId = []
        tweet.Likes.forEach(like => {
          likesId.push(like.UserId)
        })
        return {
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          fromNow: moment(tweet.createdAt).fromNow(),
          user: {
            id: tweet.User.id,
            account: tweet.User.account,
            name: tweet.User.name,
            avatar: tweet.User.avatar
          },
          repliedCount: tweet.Replies.length,
          likedCount: tweet.Likes.length,
          isLiked: likesId.includes(helpers.getUser(req).id)
        }
      })
      return res.json(replies)
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  // 查看單一使用者點過Like的推文
  // user like過的推文內容、推文的 user部分資料、推文的 reply、推文的 reply 數、推文的 like 數、推文的發布時間(fromNow)
  getLikedTweets: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) return res.json({ message: 'this user does not exist!' })
      let likes = await Like.findAll({
        where: { UserId: req.params.id },
        include: [{ model: Tweet, include: [User, Reply, Like] }],
        order: [['createdAt', 'DESC']]
      })
      if (likes.length === 0) return res.json({ message: 'this user has no like for any tweet!' })
      // 整理回傳資料
      likes = likes.map(like => {
        const tweet = like.Tweet
        // 該使用者是否喜歡
        const likesId = []
        tweet.Likes.forEach(like => {
          likesId.push(like.UserId)
        })
        return {
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          fromNow: moment(tweet.createdAt).fromNow(),
          user: {
            id: tweet.User.id,
            name: tweet.User.name,
            account: tweet.User.account,
            avatar: tweet.User.avatar
          },
          repliedCount: tweet.Replies.length,
          likedCount: tweet.Likes.length,
          isLiked: likesId.includes(helpers.getUser(req).id)
        }
      })
      return res.json(likes)
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  // 查看單一使用者的跟隨者 ( user = following , show followers )
  // account、name、avatar、introduction、followshipCreatedAt、是否有追蹤自己的追隨者
  getFollowers: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) return res.json({ message: 'this user does not exist!' })
      let follower = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [[{ model: User, as: 'Followers' }, 'createdAt', 'DESC']]
      })
      if (follower.Followers.length === 0) return res.json({ message: 'this user has no follower!' })
      // 該使用者是否在追隨
      const followingsId = []
      follower.Followings.forEach(following => {
        followingsId.push(following.id)
      })
      // 整理回傳資料
      follower = follower.Followers.map(follower => ({
        followerId: follower.id,
        account: follower.account,
        name: follower.name,
        avatar: follower.avatar,
        introduction: follower.introduction,
        followshipCreatedAt: follower.Followship.createdAt,
        isFollowing: followingsId.includes(follower.id)
      }))

      return res.json(follower)
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  // 查看單一使用者跟隨中的人 ( user = follower , show followings )
  // account、name、avatar、introduction、followshipCreatedAt
  getFollowings: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) return res.json({ message: 'this user does not exist!' })
      let followings = await User.findByPk(req.params.id, {
        include: [{ model: User, as: 'Followings' }],
        order: [[{ model: User, as: 'Followings' }, 'createdAt', 'DESC']]
      })
      if (followings.Followings.length === 0) return res.json({ message: 'this user has no following!' })
      // 該使用者是否在追隨
      const followingsId = []
      followings.Followings.forEach(following => {
        followingsId.push(following.id)
      })
      // 整理回傳資料
      followings = followings.Followings.map(following => ({
        followingId: following.id,
        account: following.account,
        name: following.name,
        avatar: following.avatar,
        introduction: following.introduction,
        followshipCreatedAt: following.Followship.createdAt,
        isFollowing: followingsId.includes(following.id)
      }))
      return res.json(followings)
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  // 查看建議追隨名單 (跟隨者數量排列前10)
  getTopUsers: async (req, res, next) => {
    try {
      const currentUser = await User.findByPk(helpers.getUser(req).id, {
        include: { model: User, as: 'Followings' }
      })
      let users = await User.findAll({
        where: { role: 'user' },
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        attributes: {
          include: [
            [
              sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'followCount'
            ]
          ]
        },
        order: [[sequelize.literal('followCount'), 'DESC']],
        limit: 10
      })
      // 該使用者是否在追隨
      const followingsId = []
      currentUser.Followings.forEach(following => {
        followingsId.push(following.id)
      })
      // 整理回傳資料
      users = users.map(user => {
        return {
          id: user.id,
          name: user.name,
          account: user.account,
          avatar: user.avatar,
          isFollowing: followingsId.includes(user.id)
        }
      })
      return res.json(users)
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  // 取得現在登入的 user 資料
  getCurrentUser: (req, res) => {
    return res.json({
      id: req.user.id,
      account: req.user.account,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      cover: req.user.cover,
      introduction: req.user.introduction,
      role: req.user.role
    })
  }
}

module.exports = userController
