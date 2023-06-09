const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { getUser } = require('../../_helpers')
const { imgurFileHandler } = require('../../helpers/file-helper')
const { User, Tweet, Reply, Like, Followship } = require('../../models')

const userController = {
  login: (req, res, next) => {
    try {
      const userData = getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token, user: userData
        }
      })
    } catch (error) {
      next(error)
    }
  },

  signUp: async (req, res, next) => {
    try {
      const errors = []
      const { name, account, email, password, checkPassword } = req.body
      // 有欄位沒有填寫 暫時的錯誤處理
      if (!name || !account || !email || !password || !checkPassword) errors.push('每個欄位都必填')
      // 密碼與確認密碼不一致
      if (password !== checkPassword) errors.push('密碼與確認密碼不一致')
      // 確認account與email是否 與 資料庫重複
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount) errors.push('account已存在')
      if (userEmail) errors.push('email已存在')
      if (errors.length) {
        // throw new Error(errors)
        return res.json({ status: 'error', message: errors })
      }
      const user = await User.create({
        name,
        account,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })
      const userData = user.toJSON()
      delete userData.password
      return res.json({ status: 'success', data: userData })
    } catch (error) {
      next(error)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      let { id } = req.params
      id = Number(id)

      // 確認使用者是否存在 與 發過文
      const [user, userTweets] = await Promise.all([
        User.findByPk(id),
        Tweet.findAll({
          where: { UserId: id },
          raw: true,
          nest: true
        })
      ])
      if (!user) throw new Error('The user does not exist')
      if (!userTweets.length) throw new Error("The user have'nt post any tweet yet")
      return res.json({ status: 'success', data: userTweets })
    } catch (error) {
      next(error)
    }
  },
  getUser: async (req, res, next) => {
    try {
      let id = req.params.id
      id = Number(id)

      // 確認使用者是否存在
      const user = await User.findByPk(id)
      if (!user) throw new Error('The user does not exist')
      res.json({ status: 'success', data: user })
    } catch (error) {
      next(error)
    }
  },
  getUserRepliedTweet: async (req, res, next) => {
    try {
      let { id } = req.params
      id = Number(id)

      // 確認使用者是否存在 與 回過文
      const [user, repliedTweets] = await Promise.all([
        User.findByPk(id),
        Reply.findAll({
          where: { UserId: id },
          include: [Tweet],
          raw: true,
          nest: true
        })
      ])
      if (!user) throw new Error('The user does not exist')
      if (!repliedTweets.length) throw new Error("The user have'nt replied any tweets yet.")

      const data = []
      for (const i of repliedTweets) {
        data.push(i.Tweet)
      }
      return res.json({ status: 'success', data })
    } catch (error) {
      next(error)
    }
  },
  getUserLiked: async (req, res, next) => {
    try {
      let { id } = req.params
      id = Number(id)

      // 確認使用者是否存在 與 喜歡的貼文
      const [user, userLiked] = await Promise.all([
        User.findByPk(id),
        Like.findAll({
          where: { UserId: Number(id) },
          include: [Tweet],
          raw: true,
          nest: true
        })
      ])
      if (!user) throw new Error('The user does not exist')
      if (!userLiked.length) throw new Error('He does not like anyone.')
      const data = []
      for (const i of userLiked) {
        data.push(i.Tweet)
      }
      return res.json({ status: 'success', data })
    } catch (error) {
      next(error)
    }
  },
  getUserFollows: async (req, res, next) => {
    try {
      let { id } = req.params
      id = Number(id)

      // 確認使用者是否存在 與 其追蹤者
      const [user, userFollows] = await Promise.all([
        User.findByPk(id),
        Followship.findAll({
          where: { followerId: Number(id) },
          raw: true,
          nest: true
        })
      ])
      if (!user) throw new Error('The user does not exist')
      if (!userFollows.length) throw new Error("He haven't followed anyone")
      const data = []
      for (const i of req.user.Followings) {
        data.push(i.dataValues)
      }
      return res.json({ status: 'success', data })
    } catch (error) {
      next(error)
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      let { id } = req.params
      id = Number(id)

      // 確認使用者是否存在 與 其追隨者
      const [user, userFollowers] = await Promise.all([
        User.findByPk(id),
        Followship.findAll({
          where: { followingId: Number(id) }
        })
      ])
      if (!user) throw new Error('The user does not exist')
      if (!userFollowers.length) throw new Error('He is lonely')

      const data = []
      for (const i of req.user.Followers) {
        data.push(i.dataValues)
      }
      return res.json({ status: 'success', data })
    } catch (error) {
      next(error)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const { email, password, name, introduction, account } = req.body
      let { id } = req.params
      id = Number(id)

      // introduction與name的字數限制
      if (introduction.length < 160) throw new Error('Your self-introduction is a little too long for me to handle! Please less than 160.')
      if (name.length < 50) throw new Error('Your self-introduction is a little too long for me to handle! ! Please less than 50.')

      // 確認使用者是否存在 與 email & account是否重複
      const [user, checkEmail, checkAccount] = await Promise.all([
        User.findByPk(id),
        User.findOne({ where: { email } }),
        User.findOne({ where: { account } })
      ])

      // 錯誤處理
      if (!user) throw new Error('The user does not exist')
      if (checkEmail) throw new Error('Oops! Your email already exist')
      if (checkAccount) throw new Error('Oops! Your account already exist')

      // 取得 avatar、background圖片
      const { file } = req
      const { avatar, background } = req
      const [avatarFilePath, backgroundFilePath] = await Promise.all([
        imgurFileHandler(avatar),
        imgurFileHandler(background)
      ])
      const updatedUser = User.update({
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        name,
        avatar: avatarFilePath || null,
        introduction,
        background: backgroundFilePath || null,
        account
      })
      res.status(200).json(updatedUser)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
