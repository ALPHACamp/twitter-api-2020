const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like, Followship } = require('../../models')
const helpers = require('../../_helpers')
const { userValidation } = require('../../helper/validations')
const { multerFilesHandler } = require('../../helper/file-helper')
const assert = require('assert')

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (password !== checkPassword) {
        throw new Error('密碼輸入錯誤，請重新確認')
      }
      const [userEmail, userAccount] = await Promise.all([
        User.findOne({ where: { email } }),
        User.findOne({ where: { account } })
      ])

      assert(!userEmail, 'email 已重複註冊！')
      assert(!userAccount, 'account 已重複註冊！')
      const user = await User.create({
        account,
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role: 'user'
      })
      return res.json({ status: 'success', data: user })
    } catch (err) {
      next(err)
    }
  },
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        raw: true,
        nest: true
      })
      assert(user, '使用者不存在')
      res.json(user)
    } catch (error) {
      next(error)
    }
  },
  putUser: async (req, res, next) => {
    const userId = req.params.id
    const { value, error } = userValidation(req.body)
    const { files } = req
    try {
      // 如若輸入的資料不合規範，丟出error
      assert(!error, error?.details[0].message)

      const { account, name, email, password, introduction } = value
      // 將圖片上傳至第三方圖庫
      // 若沒有傳入照片回傳null
      const cover = await multerFilesHandler(
        files?.cover ? files.cover[0] : null
      )
      const avatar = await multerFilesHandler(
        files?.avatar ? files.avatar[0] : null
      )
      const user = await User.findByPk(userId)
      assert(user, '使用者不存在')
      if (email) {
        const emailCheck = await User.findOne({
          where: { email },
          attributes: ['id']
        })
        assert(!(emailCheck && emailCheck.id !== user.id), '這個email已被使用')
      }
      if (account) {
        const accountCheck = await User.findOne({
          where: { account },
          attributes: ['id']
        })
        assert(!(accountCheck && accountCheck.id !== user.id), '帳號已存在')
      }

      const updatedUser = await user.update({
        account: account || user.account,
        name: name || user.name,
        email: email || user.email,
        introduction: introduction || user.introduction,
        password: password ? await bcrypt.hash(password, 10) : user.password,
        cover: cover || user.cover,
        avatar: avatar || user.avatar
      })
      res.json({
        status: 'success',
        data: updatedUser
      })
    } catch (error) {
      next(error)
    }
  }, // 獲取某使用者發過的推文
  getUserTweets: async (req, res, next) => {
    const userId = req.params.id
    try {
      assert(await User.findByPk(userId), '使用者不存在')
      const tweet = await Tweet.findAll({
        raw: true,
        nest: true,
        where: { userId },
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
        ],
        order: [['createdAt', 'DESC']]
      })
      assert(tweet.length > 0, '該使用者沒有推文')
      res.json(tweet)
    } catch (error) {
      next(error)
    }
  }, // 獲取某使用者發過回覆的推文
  getUserRepliedTweet: async (req, res, next) => {
    const userId = req.params.id
    try {
      assert(await User.findByPk(userId), '使用者不存在')
      const reliedTweet = await Reply.findAll({
        raw: true,
        nest: true,
        where: { userId },
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
        ],
        order: [['createdAt', 'DESC']]
      })
      assert(reliedTweet.length > 0, '該使用者還沒有回覆任何推文')
      res.json(reliedTweet)
    } catch (error) {
      next(error)
    }
  }, // 獲取某使用者點過的 Like
  getUserLiked: async (req, res, next) => {
    const userId = req.params.id
    assert(await User.findByPk(userId), '使用者不存在')
    try {
      const liked = await Like.findAll({
        raw: true,
        nest: true,
        where: { userId }
      })
      assert(liked.length > 0, '該使用者還沒有按喜歡')
      res.json(liked)
    } catch (error) {
      next(error)
    }
  }, // 獲取某使用者跟隨中的人
  getUserFollowers: async (req, res, next) => {
    const userId = req.params.id
    try {
      const followers = await Followship.findAll({
        raw: true,
        nest: true,
        where: { followingId: userId },
        attributes: ['followerId']
      })
      assert(followers.length, '這個使用者還沒有任何追隨者')
      res.json(followers)
    } catch (error) {
      next(error)
    }
  }, // 獲取某使用者的跟隨者
  getUserFollowings: async (req, res, next) => {
    const userId = req.params.id
    try {
      const followers = await Followship.findAll({
        raw: true,
        nest: true,
        where: { followerId: userId },
        attributes: ['followingId']
      })
      assert(followers.length, '這個使用者還沒有任何追隨者')
      res.json(followers)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
