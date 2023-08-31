const bcrypt = require('bcryptjs') // 載入 bcrypt
const jwt = require('jsonwebtoken')
const { User, Followship, Tweet, Reply, Like } = require('../models')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc') // 引入 UTC 套件
const timezone = require('dayjs/plugin/timezone') // 引入時區套件
const helper = require('../_helpers')
const { Op } = require('sequelize')
const { imgurFileHandler } = require('../helpers/file-helpers')

dayjs.extend(utc) // 使用 UTC 套件
dayjs.extend(timezone) // 使用時區套件

const userController = {
  signUp: (req, res, next) => {
    // 如果二次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.checkPassword) throw new Error('二次輸入密碼不符合!')
    // 檢查name字數，上限為50字
    if (req.body.name.length > 50) throw new Error('字數超出上限！')
    // 查找是否有該帳戶或email
    Promise.all([
      User.findOne({ where: { account: req.body.account } }),
      User.findOne({ where: { email: req.body.email } })
    ])
      .then(([account, email]) => {
        // 如果有一樣的account或email，丟錯告知前端
        if (account) throw new Error('account 已重複註冊！')
        if (email) throw new Error('email 已重複註冊！')
        // 如果檢查ok，呼叫bcrypt將使用者的密碼進行雜湊
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => {
        return User.create({
          email: req.body.email,
          password: hash,
          name: req.body.name,
          account: req.body.account,
          role: 'user'
        })
      })
      .then(user => {
        res.status(200).json({
          status: 'success',
          message: `${req.body.account}已經成功註冊!`,
          user: {
            id: user.id,
            email: user.email,
            account: user.account,
            name: user.name,
            updatedAt: dayjs(user.updatedAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss'),
            createdAt: dayjs(user.createdAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss')
          }
        })
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  signIn: (req, res, next) => {
    try {
      const userData = helper.getUser(req).toJSON()
      delete userData.password // 刪除密碼
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.status(200).json({
        status: 'success',
        message: `使用者${userData.account}已經成功登入!`,
        data: {
          token,
          user: {
            ...userData,
            updatedAt: dayjs(userData.updatedAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss'),
            createdAt: dayjs(userData.createdAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss')
          }
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUserProfile: (req, res, next) => {
    // 個人檔案
    const loginUserId = helper.getUser(req).id
    const paramsUserId = Number(req.params.id)
    // 搜尋資料庫
    return User.findByPk(paramsUserId, {
      nest: true,
      // raw: true, 因為使用raw時 sequelize無法正確取得關聯資料，只能取得第一筆關聯資料
      attributes: ['id', 'account', 'email', 'name', 'avatar', 'introduction', 'role', 'createdAt', 'updatedAt', 'banner'], // 不載入password
      include: [
        { model: User, as: 'Followers', attributes: ['id'] },
        { model: User, as: 'Followings', attributes: ['id'] }
      ]
    })
      .then(user => {
        if (!user) {
          const err = new Error('使用者profile 不存在！')
          err.status = 404
          throw err
        }
        // 如果是自己的頁面
        res.status(200).json({
          status: 'success',
          message: loginUserId === paramsUserId ? '當前檢視自己的頁面' : '當前檢視別人的頁面',
          id: user.id,
          account: user.account,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          introduction: user.introduction,
          role: user.role,
          updatedAt: dayjs(user.updatedAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss'),
          createdAt: dayjs(user.createdAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss'),
          banner: user.banner,
          followingCounts: user.Followings.length, // 追蹤數
          followerCounts: user.Followers.length // 被追蹤數
        })
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    // 取得該使用者的所有推文
    const paramsUserId = Number(req.params.id)
    Promise.all([
      User.findByPk(paramsUserId),
      Tweet.findAll({
        where: { UserId: paramsUserId },
        raw: true
      })
    ])
      .then(([user, tweets]) => {
        if (!user) {
          const err = new Error('使用者不存在！')
          err.status = 404
          throw err
        }
        if (tweets.length === 0) {
          return res.status(200).json({
            status: 'success',
            message: '此使用者沒有任何推文'
          })
        }
        return tweets.map(tweet => ({ ...tweet }))
      })
      .then(tweets => res.status(200).json(tweets))
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    // 瀏覽某使用者回覆過的留言
    const paramsUserId = Number(req.params.id)
    Promise.all([
      User.findByPk(paramsUserId),
      Reply.findAll({
        where: { UserId: paramsUserId },
        include: [
          { model: Tweet }
        ]
      })
    ])
      .then(([user, replies]) => {
        if (!user) {
          const err = new Error('使用者不存在！')
          err.status = 404
          throw err
        }
        if (replies.length === 0) {
          return res.status(200).json({
            status: 'success',
            message: '此使用者沒有任何回覆'
          })
        }
        return res.status(200).json(replies)
      })
      .catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {
    // 瀏覽某使用者點過的 Like
    const paramsUserId = Number(req.params.id)
    Promise.all([
      User.findByPk(paramsUserId),
      Like.findAll({
        where: { UserId: paramsUserId },
        include: [
          { model: Tweet }
        ]
      })
    ])
      .then(([user, likes]) => {
        if (!user) {
          const err = new Error('使用者不存在！')
          err.status = 404
          throw err
        }
        if (likes.length === 0) {
          return res.status(200).json({
            status: 'success',
            message: '此使用者沒有任何Like'
          })
        }
        return res.status(200).json(likes)
      })
      .catch(err => next(err))
  },
  getUserFollowings: (req, res, next) => {
    // 瀏覽某使用者跟隨中的人
    const paramsUserId = Number(req.params.id)
    Promise.all([
      User.findByPk(paramsUserId),
      Followship.findAll({
        where: { followerId: paramsUserId },
        attributes: ['followingId']
      })
    ])
      .then(([user, followings]) => {
        if (!user) {
          const err = new Error('使用者不存在！')
          err.status = 404
          throw err
        }
        if (followings.length === 0) {
          return res.status(200).json({
            status: 'success',
            message: '此使用者沒有追蹤任何人'
          })
        }
        const resFollowingIds = followings.map(item => item.followingId) // 將findAll找到的追蹤的ID存成陣列，如[5,8,9]
        return User.findAll({
          where: {
            id: resFollowingIds // 在用這個陣列去找使用者出來
          },
          attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
        })
      })
      .then(users => {
        return res.status(200).json(users.map(user => {
          return {
            id: user.id,
            account: user.account,
            name: user.name,
            avatar: user.avatar,
            introduction: user.introduction,
            role: user.role,
            updatedAt: dayjs(user.updatedAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss'),
            createdAt: dayjs(user.createdAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss'),
            followingId: user.id
          }
        }))
      })
      .catch(err => next(err))
  },
  getUserFollowers: (req, res, next) => {
    // 瀏覽某使用者跟隨中的人
    const paramsUserId = Number(req.params.id)
    Promise.all([
      User.findByPk(paramsUserId),
      Followship.findAll({
        where: { followingId: paramsUserId },
        attributes: ['followerId']
      })
    ])
      .then(([user, followers]) => {
        if (!user) {
          const err = new Error('使用者不存在！')
          err.status = 404
          throw err
        }
        if (followers.length === 0) {
          return res.status(200).json({
            status: 'success',
            message: '此使用者沒有任何人追蹤'
          })
        }
        const resFollowerIds = followers.map(item => item.followerId) // 將findAll找到的追蹤者的ID存成陣列，如[5,8,9]
        return User.findAll({
          where: {
            id: resFollowerIds // 在用這個陣列去找使用者出來
          },
          attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
        })
      })
      .then(users => {
        return res.status(200).json(users.map(user => {
          return {
            id: user.id,
            account: user.account,
            name: user.name,
            avatar: user.avatar,
            introduction: user.introduction,
            role: user.role,
            updatedAt: dayjs(user.updatedAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss'),
            createdAt: dayjs(user.createdAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss'),
            followerId: user.id
          }
        }))
      })
      .catch(err => next(err))
  },
  putUserProfile: (req, res, next) => {
    // 編輯個人資料
    const paramsUserId = Number(req.params.id)
    const { name, introduction } = req.body // 這邊用name，而不是account ，account是setting的部分
    const { files } = req // 如果前端沒有傳入檔案，這邊會是undefined
    const loginUserId = helper.getUser(req).id
    if (paramsUserId !== loginUserId) {
      const err = new Error('只能編輯自己的資料！')
      err.status = 403
      throw err
    }
    if (!name || !name.trim()) throw new Error('名稱是必須的！')
    if (name.length > 50) throw new Error('名稱字數超出上限!')
    if (introduction.length > 160) throw new Error('自我介紹字數超出上限!')
    // 以下三行是為了因應測試檔所做的改動，先確認files有東西，並將裡面的東西放進fileHandlers陣列裡，在Promise.all中展開使用
    const fileHandlers = []
    if (files && files.avatar) fileHandlers.push(imgurFileHandler(files.avatar[0])) // 處理 avatar 的檔案
    if (files && files.banner) fileHandlers.push(imgurFileHandler(files.banner[0])) // 處理 banner 的檔案
    return Promise.all([
      User.findByPk(paramsUserId),
      ...fileHandlers
    ])
      .then(([user, avatarFilePath, bannerFilePath]) => {
        if (!user) throw new Error('使用者不存在!')
        return user.update({
          name: name || user.name,
          introduction: introduction,
          avatar: avatarFilePath || user.avatar,
          banner: bannerFilePath || user.banner
        })
      })
      .then(() => {
        return res.status(200).json({
          status: 'success',
          message: '個人資料編輯完成!'
        })
      })
      .catch(err => next(err))
  },
  getUserSetting: (req, res, next) => {
    // 瀏覽設定頁面
    const paramsUserId = Number(req.params.id)
    const loginUserId = helper.getUser(req).id
    if (paramsUserId !== loginUserId) {
      const err = new Error('只能查看自己的資料！')
      err.status = 403
      throw err
    }
    return User.findByPk(paramsUserId)
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        res.json({
          account: user.account,
          name: user.name,
          email: user.email
        })
      })
  },
  putUserSetting: (req, res, next) => {
    // 編輯設定頁面
    const { account, name, email, password, checkPassword } = req.body
    const paramsUserId = Number(req.params.id)
    const loginUserId = helper.getUser(req).id
    if (paramsUserId !== loginUserId) {
      const err = new Error('只能編輯自己的資料！')
      err.status = 403
      throw err
    }
    if (!account || !account.trim()) throw new Error('帳號是必須的！')
    if (!password || !password.trim() || !checkPassword || !checkPassword.trim()) throw new Error('密碼是必須的！')
    if (!name || !name.trim()) throw new Error('名稱是必須的！')
    if (name.length > 50) throw new Error('名稱字數超出上限!')
    if (!email || !email.trim()) throw new Error('email是必須的!')
    if (password !== checkPassword) throw new Error('二次輸入密碼不符合!')
    let updateData = {}
    // 查找是否有該帳戶或email
    Promise.all([
      User.findOne({
        where: {
          [Op.or]: [
            { account: account },
            { email: email }
          ],
          id: {
            [Op.ne]: paramsUserId
          }
        }
      }),
      bcrypt.hash(password, 10)
    ])
      .then(([existingUser, hash]) => {
        // 如果有一樣的account或email，丟錯告知前端
        if (existingUser) {
          if (existingUser.account === account) {
            throw new Error('該account 已有人使用！')
          } else if (existingUser.email === email) {
            throw new Error('該email 已有人使用！')
          }
        }
        // 如果檢查ok，將使用者要更新的資料存進updateData
        updateData = {
          email: email,
          password: hash,
          name: name,
          account: account,
          updatedAt: new Date()
        }
        return User.findByPk(paramsUserId)
      })
      .then(user => {
        return user.update(updateData)
      })
      .then(user => {
        res.status(200).json({
          status: 'success',
          message: `${account}已經成功修改資料!`,
          user: {
            id: user.id,
            email: user.email,
            account: user.account,
            name: user.name,
            updatedAt: dayjs(user.updatedAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss'),
            createdAt: dayjs(user.createdAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss')
          }
        })
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  }
}

module.exports = userController
