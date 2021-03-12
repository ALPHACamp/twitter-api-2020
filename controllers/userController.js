const bcrypt = require('bcryptjs')
const imgur = require('imgur')
const formatDistanceToNow = require('date-fns/formatDistanceToNow')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const { Tweet, User, Followship, Like, Reply, sequelize } = require('../models')
const { QueryTypes } = require('sequelize')
const { includeCountData, includeUserData } = require('./common.js')
const helpers = require('../_helpers')
const jwt = require('jsonwebtoken')


const userController = {
  // // 測試用登入
  signInTest: (req, res) => {
    // 取得資料
    const { email, password } = req.body
    // 檢查必要資料
    if (!email || !password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    // 查詢user
    User.findOne({ where: { email } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: '使用者未註冊' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '密碼錯誤' })
      }
      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, 'alphacamp')
      const data = {
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          account: user.account,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          avatar: user.avatar
        }
      }
      return res.render('index', data)
    })
      .catch(err => {
        return res.status(500).json({ status: 'error', message: '伺服器錯誤請稍後', err })
      })

  },


  // 登入
  signIn: (req, res) => {
    // 取得資料
    const { email, password } = req.body
    // 檢查必要資料
    if (!email || !password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    // 查詢user
    User.findOne({ where: { email } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: '使用者未註冊' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '密碼錯誤' })
      }
      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, 'alphacamp')
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          account: user.account,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          avatar: user.avatar
        }
      })
    })
      .catch(err => {
        return res.status(500).json({ status: 'error', message: '伺服器錯誤請稍後', err })
      })
  },
  // 註冊
  signUp: async (req, res) => {
    // 取回資料
    const { account, name, email, password, checkPassword } = req.body
    // 回傳user註冊資料
    const userData = { account, name, email, password, checkPassword }
    // 判斷所有項目都到齊
    if (!account || !name || !email || !password || !checkPassword) {
      return res.status(400).json({ status: 'error', message: '所有欄位都是必填', userData })
    }
    // 判斷密碼不相符
    if (password !== checkPassword) {
      return res.status(400).json({ status: 'error', message: '密碼與確認密碼不相符', userData })
    }
    try {
      // 判斷 Account 與 Email 是否重複註冊
      const errors = []
      const [duplicateAccount, duplicateEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (duplicateAccount) {
        errors.push('帳號已重複')
      }
      if (duplicateEmail) {
        errors.push('信箱已重複')
      }
      if (errors.length) {
        return res.status(400).json({ status: 'error', message: errors, userData })
      } else {
        // 建立使用者
        const passwordBcrypt = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        User.create({
          account, name, email, password: passwordBcrypt
        }).then(user => {
          return res.status(200).json({ status: 'success', message: '註冊成功' })
        }).catch(err => res.status(500).json({ status: 'error', message: '註冊流程-伺服器錯誤請稍後', err }))
      }
    } catch (err) {
      res.status(500).json({ status: 'error', message: '註冊流程-伺服器錯誤請稍後', err })
    }
  },
  // 獲取當前用戶
  getCurrentUser: (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const attributes = ['role', 'password', 'createdAt', 'updatedAt']
      attributes.forEach(item => delete user.dataValues[item])
      return res.json(user)
    } catch (err) {
      res.status(500).json({ status: 'error', message: '獲取當前用戶-伺服器錯誤請稍後', err })
    }
  },

  // 瀏覽個人資料
  getUser: (req, res) => {
    const userId = req.params.id
    return User.findOne({
      where: { id: userId },
      attributes: {
        include: [
          [sequelize.literal(`(SELECT Count(*) FROM Followships WHERE Followships.followerId = ${userId})`), 'FollowingsCount'],
          [sequelize.literal(`(SELECT Count(*) FROM Followships WHERE Followships.followingId = ${userId})`), 'FollowersCount'],
          [sequelize.literal(`(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = ${userId})`), 'userTweetsCount'],
          [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = ${userId})`), 'likedTweetsCount'],
          [sequelize.literal(`(SELECT COUNT(*) FROM Replies WHERE Replies.UserId = ${userId})`), 'replyTweetsCount'],
        ]
      }
    }).then(user => {
      return res.status(200).json(user)
    })
      .catch(err => {
        return res.status(500).json({ status: 'error', message: '個人資料-伺服器錯誤請稍後', err })
      })
  },
  // 編輯個人資料
  putUser: async (req, res) => {
    const { name, introduction } = req.body
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      return res.json({ status: 'error', message: '無訪問權限' })
    }
    if (!name) {
      return res.json({ status: 'error', message: '請輸入名稱' })
    }
    try {
      const { files } = req
      const user = await User.findByPk(req.params.id)
      if (files !== undefined) {
        if (Object.keys(req.files).length) {
          // 建立上傳照片Functions
          function myImgurUpload(uploadFile) {
            imgur.setClientId(IMGUR_CLIENT_ID)
            return imgur.uploadFile(uploadFile)
          }
          // 解構賦值
          let [cover, avatar] = [user.cover, user.avatar]
          //依序判斷 avatar & cover 是否存在 , 如果有就上傳
          if (files.cover !== undefined) {
            coverdata = await myImgurUpload(req.files.cover[0].path)
            cover = coverdata.link
          } else {
            cover = ''
          }
          if (files.avatar !== undefined) {
            avatardata = await myImgurUpload(req.files.avatar[0].path)
            avatar = avatardata.link
          } else {
            avatar = ''
          }
          console.log(cover)
          console.log(avatar)
          await user.update({ name, introduction, cover, avatar })
          return res.status(200).json({ status: 'success', message: '修改成功' })
        }
      }
      // 無照片
      await user.update({ name, introduction })
      return res.status(200).json({ status: 'success', message: '修改成功' })
    } catch (err) {
      return res.status(500).json({ status: 'error', message: '編輯個人資料-伺服器錯誤請稍後', err })
    }
  },
  // 正在追蹤誰
  getFollowings: async (req, res) => {
    try {
      const followings = await sequelize.query(`
      SELECT U.id, U.name, U.account, U.email, U.avatar, U.introduction, Followships.followingId , Followships.followerId
      FROM Followships
      LEFT JOIN (SELECT id, name, account, email, avatar, introduction FROM Users) AS U
      ON U.id = Followships.followingId
      WHERE Followships.followerId = ${req.params.id}
      `,
        { type: QueryTypes.SELECT })
      const user = await User.findByPk(helpers.getUser(req).id, {
        include: [
          { model: User, as: 'Followings' },
        ],
      })
      followingsmap = followings.map(following => ({
        ...following,
        isFollowed: user.Followings.map(d => d.id).includes(following.id)
      }))
      return res.status(200).json(followingsmap)
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'getFollowings-伺服器錯誤請稍後', err })
    }
  },
  // 誰在追蹤這個使用者
  getFollowers: async (req, res) => {
    try {
      const followers = await sequelize.query(`
      SELECT  Users.id, Users.name, Users.account, Users.email, Users.avatar, Users.introduction, Followships.followerId, Followships.followingId
      FROM Followships
      LEFT JOIN Users
      ON Users.id = Followships.followerId
      WHERE Followships.followingId = ${req.params.id}
      `,
        { type: QueryTypes.SELECT })
      const user = await User.findByPk(helpers.getUser(req).id, {
        include: [
          { model: User, as: 'Followings' },
        ],
      })
      followersmap = followers.map(follower => ({
        ...follower,
        isFollowed: user.Followings.map(d => d.id).includes(follower.id)
      }))

      return res.status(200).json(followersmap)
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'getFollowers-伺服器錯誤請稍後', err })
    }
  },
  // 看見某使用者發過回覆的推文
  getRepliedTweets: (req, res) => {
    Reply.findAll({
      include: [
        { model: Tweet, include: Like },
        // Tweet, 
        includeUserData()
      ],
      where: { UserId: req.params.id },
      attributes: {
        include: includeCountData()
      },
      raw: true,
      nest: true,
      // 資料庫端進行排列
      order: [[sequelize.literal('createdAt'), 'DESC']]
    }).then(reply => {

      const data = reply.map(item => ({
        ...item,
        isLiked: item.Tweet.Likes.UserId === req.user.id
      }))
      return res.status(200).json(data)
    })
      .catch(err => {
        return res.status(500).json({ status: 'error', message: 'getUserTweets-伺服器錯誤請稍後', err })
      })

  },
  // 看見某使用者點過的 Like 
  getLikeTweets: (req, res) => {
    return Promise.all([
      Tweet.findAll({
        include: [
          { model: Like, where: { UserId: req.params.id } },
          includeUserData()
        ],
        // where: { UserId: req.params.id },
        attributes: {
          include: includeCountData()
        },
        raw: true,
        nest: true,
        order: [[{ model: Like }, 'createdAt', 'DESC']]
      }),
      User.findByPk(req.user.id, {
        include: [
          { model: Like, where: { UserId: req.user.id } },
        ],
      })
    ]).then(([likeUser, loginUser]) => {
      const loginUserLikeData = loginUser.Likes.map(item => item.TweetId)
      const data = likeUser.map(item => ({
        ...item,
        isLiked: loginUserLikeData.filter(r => [item.id].includes(r)).length > 0
      }))
      return res.status(200).json(data)
    }).catch(err => {
      return res.status(500).json({ status: 'error', message: 'getLikeTweets-伺服器錯誤請稍後', err })
    })
  },
  // 看見某使用者發過的推文
  getUserTweets: (req, res) => {
    return Tweet.findAll({
      include: [
        Like,
        includeUserData(),
      ],
      where: { UserId: req.params.id },
      attributes: {
        include: includeCountData()
      },
      // raw: true,
      // nest: true,
      // 資料庫端進行排列
      order: [[sequelize.literal('createdAt'), 'DESC']]
    }).then(user => {
      const data = user.map(item => ({
        ...item.dataValues,
        Time: formatDistanceToNow(item.createdAt, { includeSeconds: true }),
        isLiked: item.Likes.map(d => d.UserId).includes(req.user.id)
      }))

      return res.status(200).json(data)
    })
      .catch(err => {
        return res.status(500).json({ status: 'error', message: 'getUserTweets-伺服器錯誤請稍後', err })
      })
  },
  // 推薦前十個追蹤者
  getTopUser: (req, res) => {
    return User.findAll({
      include: { model: User, as: 'Followers' },
      attributes: {
        exclude: ['updatedAt', 'createdAt', 'password', 'role'],
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'FollowingCount'],
        ]
      },
      order: [
        [sequelize.literal('FollowingCount'), 'DESC']
      ],
      raw: true,
      nest: true,
      limit: 10,
    }).then(users => {
      // 過濾重複物件
      const set = new Set()
      const tweetsFilter = users.filter(item => !set.has(item.id) ? set.add(item.id) : false)
      // 取出 login user Followings 
      const userFollowingData = req.user.toJSON().Followings.map(item => item.id)
      const data = tweetsFilter.map(item => ({
        ...item,
        // userTop10 與 userFollowingData 做比對
        isFollowed: userFollowingData.includes(item.id)
      }))
      return res.status(200).json(data)
    })
  },
  putUserAcoount: async (req, res) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const currentUser = helpers.getUser(req)
      const user = await User.findByPk(currentUser.id)
      const errors = []
      // 判斷所有項目都到齊
      if (!account || !name || !email || !password || !checkPassword) {
        return res.status(400).json({ status: 'error', message: '所有欄位都是必填' })
      }
      // 判斷密碼不相符
      if (password !== checkPassword) {
        return res.status(400).json({ status: 'error', message: '密碼與確認密碼不相符' })
      }

      //判斷有沒有修改account
      if (user.account !== account) {
        await User.findOne({ where: { account } }).then(user => {
          if (user) {
            errors.push('帳號已重複')
          }
        })
      }
      //判斷有沒有修改email
      if (user.email !== email) {
        await User.findOne({ where: { email } }).then(user => {
          if (user) {
            errors.push('信箱已重複')
          }
        })
      }
      if (errors.length) {
        return res.status(400).json({ status: 'error', message: errors })
      } else {
        // 修改使用者資料
        const passwordBcrypt = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        user.update({
          account, name, email, password: passwordBcrypt
        }).then(user => {
          return res.status(200).json({ status: 'success', message: '修改成功' })
        }).catch(err => res.status(500).json({ status: 'error', message: '伺服器錯誤請稍後', err }))
      }
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'getFollowings-伺服器錯誤請稍後', err })
    }
  }

}

module.exports = userController

