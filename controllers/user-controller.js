const jwt = require('jsonwebtoken')
const { User } = require('../models')
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')
const helpers = require('../_helpers')

const userController = {
  signIn: (req, res, next) => {
    try {
      const user = helpers.getUser(req).toJSON()
      delete user.password
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '3d' })
      res.json({
        status: 'success',
        data: {
          token,
          user
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account || !name || !email || !password || !checkPassword) throw new Error('all fields are required')
      if (password !== checkPassword) throw new Error('password and checkPassword not matched')
      if (name.length > 50) throw new Error('name length should be less than 50')
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount) throw new Error('the account has already been used by someone else')
      if (userEmail) throw new Error('the email has already been registered by someone else')
      const userCreate = await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      const user = userCreate.toJSON()
      delete user.password
      res.json({
        status: 'success',
        data: { user }
      })
    } catch (err) {
      next(err)
    }
  },
  getSetting: async (req, res, next) => {
    try {
      if (Number(req.params.id) !== helpers.getUser(req).id) return res.status(403).json({ status: 'error', message: 'permission denied' })
      const user = await User.findByPk(req.params.id, { raw: true })
      if (!user) throw new Error('user not exist')
      delete user.password
      res.json({
        status: 'success',
        data: { user }
      })
    } catch (err) {
      next(err)
    }
  },
  patchSetting: async (req, res, next) => {
    try {
      if (Number(req.params.id) !== helpers.getUser(req).id) return res.status(403).json({ status: 'error', message: 'permission denied' })
      const { account, name, email, password, checkPassword } = req.body
      const text = !account ? Object.keys({account})[0] : !name ? Object.keys({name})[0] : !email ? Object.keys({email})[0] : null  
      if (text) throw new Error(`${text} is required`)
      if (name.length > 50) throw new Error('name length should be less than 50')
      if ((password || checkPassword) && password !== checkPassword) throw new Error('password and checkPassword not matched')
      const [user, userAccount, userEmail] = await Promise.all([
        User.findByPk(req.params.id),
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount && user.id !== userAccount.id) throw new Error('the account has already been used by someone else')
      if (userEmail && user.id !== userEmail.id) throw new Error('the email has already been registered by someone else')
      const userUpdate = await user.update({
        account,
        name,
        email,
        password: password ? bcrypt.hashSync(password, 10) : user.toJSON().password
      })
      const userJSON = userUpdate.toJSON()
      delete userJSON.password
      res.json({
        status: 'success',
        data: { user: userJSON }
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const userFind = await User.findByPk(req.params.id, { raw: true })
      if (!userFind) throw new Error('user not exist')
      const currentUser = helpers.getUser(req)
      delete currentUser.password
      const { id, name, introduction, avatar, banner } = userFind
      res.json({
        status: 'success',
        id, name, introduction, avatar, banner,
        currentUser
      })
    } catch (err) {
      next(err)
    }
  },
    putUser: async (req, res, next) => {
    try {
      if (Number(req.params.id) !== helpers.getUser(req).id) return res.status(403).json({ status: 'error', message: 'permission denied' })
      const userFind = await User.findByPk(req.params.id)
      if (!userFind) throw new Error('user not exist')
      const { name, introduction } = req.body
      const { avatar, banner } = req.files
      if (!name) throw new Error('name is required')
      if (name.length > 50) throw new Error('name length should be less than 50')
      if (introduction && introduction.length > 160) throw new Error('introduction length should be less than 160')
      const avatarPath = avatar ? await imgurFileHandler(avatar[0]) : userFind.avatar
      const bannerPath = banner ? await imgurFileHandler(banner[0]) : userFind.banner
      const userUpdate = await userFind.update({
        name,
        introduction,
        avatar: avatarPath,
        banner: bannerPath
      })
      const user = userUpdate.toJSON()
      delete user.password
      res.json({
        status: 'success',
        data: { user }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController