const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const helpers = require('../_helpers')

const { User, Tweet, Reply } = require('../models')

const userController = {
  signIn: async (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      return res.json({
        status: 'success',
        message: '登入成功!',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const errors = []

      // check if all the required fields are filled out correctly
      if (!account || !name || !email || !password || !checkPassword) {
        errors.push('所有欄位皆必填')
      }
      if (name && !validator.isByteLength(name, { max: 50 })) {
        errors.push('字數超出上限，請將字數限制在 50 字以內')
      }
      if (password && !validator.isByteLength(password, { min: 8, max: 20 })) {
        errors.push(
          '密碼長度介於 8 ~ 20 字元'
        )
      }
      if (password !== checkPassword) {
        errors.push('密碼與確認密碼不相符')
      }
      if (email && !validator.isEmail(email)) {
        errors.push('請輸入有效的 email 格式')
      }

      // Check if account and email are unique
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount) errors.push('帳號已重複註冊！')
      if (userEmail) errors.push('Email已重複註冊！')

      // Return error message if there are errors
      if (errors.length) {
        return res.status(400).json({ status: 'error', errors })
      }

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Create user in DB
      await User.create({
        account,
        name,
        email,
        password: hashedPassword
      })

      return res
        .status(200)
        .json({ status: 'success', message: '註冊成功！' })
    } catch (err) {
      next(err)
    }
  },
  getRepliedTweets: async (req, res, next) => {
    try {
      const { userId } = req.params
      const reply = await Reply.findAll({
        where: { UserId: userId },
        include: [
          { model: User, attributes: ['name', 'avatar', 'account'] },
          {
            model: Tweet,
            attributes: [],
            include: [{ model: User, attributes: ['account'] }]
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!reply) {
        return res.status(404).json({ status: 'error', message: '回覆不存在' })
      }
      return res.status(200).json({ status: 'success', data: reply })
    } catch (error) { next(error) }
  },
  putUser: async (req, res, next) => {
    try {
      const { userId } = req.params
      if (Number(userId) !== Number(helpers.getUser(req).id)) {
        return res
          .status(403)
          .json({ status: 'error', message: 'Access denied!' })
      }
      const { account, name, email, password, checkPassword, introduction } = req.body
      const errors = []
      // check if all the required fields are filled out correctly
      if (!account || !name || !email || !password || !checkPassword ) {
        errors.push('所有欄位皆必填')
      }
      if (name && !validator.isByteLength(name, { max: 50 })) {
        errors.push('字數超出上限，請將字數限制在 50 字以內')
      }
      if (password && !validator.isByteLength(password, { min: 8, max: 20 })) {
        errors.push('密碼長度介於 8 ~ 20 字元')
      }
      if (password !== checkPassword) {
        errors.push('密碼與確認密碼不相符')
      }
      if (introduction && !validator.isByteLength(introduction, { max: 160 })) {
        errors.push("字數超出上限，請將字數限制在 160 字以內");
      }
      if (email && !validator.isEmail(email)) {
        errors.push('請輸入有效的 email 格式')
      }
      if (email && email !== helpers.getUser(req).email) {
        const ifEmailDuplicate = await User.findOne({ where: { email } });
        if (ifEmailDuplicate) {
          errors.push("此Email已被註冊!");
        }
      }
      if (account !== helpers.getUser(req).account) {
        const ifAccountDuplicate = await User.findOne({ where: { account } })
        if (ifAccountDuplicate) {
          errors.push('此帳號已被註冊!')
        }
      }

      if (errors.length) {
        return res.status(400).json({ status: 'error', errors })
      }

      const user = await User.findByPk(req.params.userId)
      if (!user) {
        return res.status(404).json({ status: 'error', message: '帳戶不存在' })
      }
      const updatedPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      // const salt = await bcrypt.genSalt(10)
      // const hashedPassword = await bcrypt.hash(password, salt)
      await user.update({
        name,
        account,
        email,
        password: updatedPassword, 
        introduction
      })
      return res.status(200).json({ status: 'success', message: '設定成功' })
    } catch (error) { next(error) }
  }
}
module.exports = userController
