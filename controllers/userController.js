const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

// dayjs
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const imgur = require('imgur-node-api')
const sequelize = require('sequelize')
const { Op } = require('sequelize')

const helpers = require('../_helpers')

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const uploadImg = path => {
  return new Promise((resolve, reject) => {
    imgur.upload(path, (err, img) => {
      if (err) {
        return reject(err)
      }
      return resolve(img)
    })
  })
}

const userController = {
  // 登入
  login: async (req, res, next) => {
    try {
      const { account, password } = req.body
      // 確認 account & password必填
      if (!account || !password) {
        return res.status(400).json({ status: 'error', message: 'account and password are required!' })
      }
      // 確認 account 是否已存在資料庫
      const user = await User.findOne({ where: { account } })
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'this account has not been registered!' })
      }
      // 確認使用者的 role, 必須是 'user'
      if (user.role !== 'user') {
        return res.status(403).json({ status: 'error', message: 'you don\'t have authority to login!' })
      }
      // 確認 password 是否正確
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'password incorrect!' })
      }
      // 回傳使用者資訊和 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.status(200).json({
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
      // 確認 account & name & email & password & checkPassword 必填
      if (!account || !name || !email || !password || !checkPassword) {
        return res.status(400).json({ status: 'error', message: 'account, name, email, password, checkPassword are required!' })
      }
      // 確認 password & checkPassword 相同
      if (password !== checkPassword) {
        return res.status(400).json({ status: 'error', message: 'password & checkPassword must be same!' })
      }
      // 確認 email 格式正確
      const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
      if (!emailRule.test(email)) {
        return res.status(400).json({ status: 'error', message: 'email format is incorrect!' })
      }
      // 確認 email & account 沒有被使用
      const user = await User.findAll({
        where: { [Op.or]: [{ email }, { account }] }
      })
      if (user.length) { return res.status(409).json({ status: 'error', message: 'this account or email has been used!' }) }
      // 新增 user
      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        role: 'user'
      })
      return res.status(200).json({ status: 'success', message: 'register success!' })
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
      if (!user) { return res.status(404).json({ message: 'can not find this user!' }) }
      // 現在使用者是否在追隨
      const followings = helpers.getUser(req).Followings.map(following => following.id)
      // 現在使用者是否有訂閱
      const authors = helpers.getUser(req).Authors.map(author => author.id)

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
        followerCount: user.Followers.length,
        isFollowing: followings.includes(user.id),
        isSubscript: authors.includes(user.id)
      }
      return res.status(200).json(user)
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
      if (userId !== id) { return res.status(403).json({ status: 'error', message: 'can not edit profile of other users!' }) }
      // 取得編輯資料
      const { account, name, email, password, checkPassword, introduction } = req.body
      // 判斷 password 是否等於 checkPassword
      if (password !== checkPassword) { return res.status(400).json({ status: 'error', message: 'password & checkPassword must be same!' }) }
      // 確認 email & account 沒有被使用
      const users = await User.findAll({
        where: {
          [Op.or]: [{ email }, { account }],
          [Op.not]: [{ id: userId }]
        }
      })
      if (users.length) { return res.status(409).json({ status: 'error', message: 'this account or email has been used!' }) }
      // 找出使用者
      const user = await User.findByPk(userId)
      // 整理更新資料
      const updateData = { account, name, email, password, introduction }
      // 處理圖片
      const { files } = req
      const imgType = ['.jpg', '.jpeg', '.png']
      if (files) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        for (const file in files) {
          const index = files[file][0].originalname.lastIndexOf('.')
          const fileType = files[file][0].originalname.slice(index)
          if (imgType.includes(fileType)) {
            const img = await uploadImg(files[file][0].path)
            updateData[file] = img.data.link
          } else {
            return res.status(400).json({ status: 'error', message: `image type of ${file} is not avaliable, please upload .jpg, .jpeg, .png file!` })
          }
        }
      }
      await user.update(updateData)
      return res.status(200).json({ status: 'success', message: 'profile edit success!' })
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
      if (!user) return res.status(401).json({ message: 'can not find this user!' })
      let tweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        include: [User, Reply, Like],
        order: [['createdAt', 'DESC']]
      })
      if (!tweets.length) { return res.status(200).json({ message: 'this user has no tweet!' }) }
      // 整理回傳資料
      tweets = tweets.map(tweet => {
        // 該使用者是否喜歡
        const likeId = tweet.Likes.map(like => like.UserId)
        return {
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          fromNow: dayjs(tweet.createdAt).fromNow(),
          user: {
            id: tweet.User.id,
            name: tweet.User.name,
            account: tweet.User.account,
            avatar: tweet.User.cover
          },
          repliedCount: tweet.Replies.length,
          likedCount: tweet.Likes.length,
          isLiked: likeId.includes(helpers.getUser(req).id)
        }
      })
      return res.status(200).json(tweets)
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
      if (!user) return res.status(401).json({ message: 'this user does not exist!' })
      let replies = await Reply.findAll({
        where: { UserId: req.params.id },
        include: [{ model: Tweet, include: [User, Reply, Like] }],
        order: [['createdAt', 'DESC']]
      })
      if (!replies.length) { return res.status(200).json({ message: 'this user has no reply for any tweet!' }) }
      // 整理回傳資料
      replies = replies.map(reply => {
        const tweet = reply.Tweet
        // 該使用者是否喜歡
        const likeId = tweet.Likes.map(like => like.UserId)
        return {
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          fromNow: dayjs(tweet.createdAt).fromNow(),
          user: {
            id: tweet.User.id,
            account: tweet.User.account,
            name: tweet.User.name,
            avatar: tweet.User.avatar
          },
          repliedCount: tweet.Replies.length,
          likedCount: tweet.Likes.length,
          isLiked: likeId.includes(helpers.getUser(req).id)
        }
      })
      return res.status(200).json(replies)
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
      if (!user) { return res.status(401).json({ message: 'this user does not exist!' }) }
      let likes = await Like.findAll({
        where: { UserId: req.params.id },
        include: [{ model: Tweet, include: [User, Reply, Like] }],
        order: [['createdAt', 'DESC']]
      })
      if (!likes.length) { return res.status(200).json({ message: 'this user has no like for any tweet!' }) }
      // 整理回傳資料
      likes = likes.map(like => {
        const tweet = like.Tweet
        return {
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          fromNow: dayjs(tweet.createdAt).fromNow(),
          user: {
            id: tweet.User.id,
            name: tweet.User.name,
            account: tweet.User.account,
            avatar: tweet.User.avatar
          },
          repliedCount: tweet.Replies.length,
          likedCount: tweet.Likes.length,
          isLiked: true
        }
      })
      return res.status(200).json(likes)
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
      if (!user) return res.status(401).json({ message: 'this user does not exist!' })
      let follower = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [[{ model: User, as: 'Followers' }, 'createdAt', 'DESC']]
      })
      if (!follower.Followers.length) return res.status(200).json({ message: 'this user has no follower!' })
      // 現在使用者是否在追隨
      const followingsId = helpers.getUser(req).Followings.map(following => following.id)
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

      return res.status(200).json(follower)
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
      if (!user) { return res.status(401).json({ message: 'this user does not exist!' }) }
      let followings = await User.findByPk(req.params.id, {
        include: [{ model: User, as: 'Followings' }],
        order: [[{ model: User, as: 'Followings' }, 'createdAt', 'DESC']]
      })
      if (!followings.Followings.length) { return res.status(200).json({ message: 'this user has no following!' }) }
      // 現在使用者是否在追隨
      const followingsId = helpers.getUser(req).Followings.map(following => following.id)
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
      return res.status(200).json(followings)
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  // 查看建議追隨名單 (跟隨者數量排列前10)
  getTopUsers: async (req, res, next) => {
    try {
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
      // 現在使用者是否在追隨
      const followingsId = helpers.getUser(req).Followings.map(following => following.id)
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
      return res.status(200).json(users)
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  // 取得現在登入的 user 資料
  getCurrentUser: (req, res) => {
    return res.status(200).json({
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
