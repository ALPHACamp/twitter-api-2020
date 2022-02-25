const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../../_helpers')
const { Op } = require('sequelize')
const { User } = require('../../models')
const { imgurFileHandler } = require('../../helpers/file-helpers')
const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES || '30m'

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account || !name || !email || !password || !checkPassword) throw new Error('account, name, email, password, checkPassword is require!')
      if (password !== checkPassword) throw new Error('Password do not match!')
      const userAccountExisted = await User.findOne({ where: { account } })
      if (userAccountExisted) throw new Error('Account already exists!')
      const userEmailExisted = await User.findOne({ where: { email } })
      if (userEmailExisted) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(password, await bcrypt.genSalt(10))
      const user = await User.create({
        account,
        name,
        email,
        password: hash,
        role: 'user'
      })
      delete user.password
      res.json({
        status: 'success',
        data: {
          user
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signIn: (req, res, next) => {
    const userData = helpers.getUser(req).toJSON()
    try {
      // 非使用者不能登入前台
      if (userData.role !== 'user') throw new Error('Account or Password is wrong!')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES })
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
  putUser: async (req, res, next) => {
    try {
      const { name, introduction } = req.body
      if (!name) throw new Error('name is require!')
      const userId = Number(helpers.getUser(req).id)
      const editId = Number(req.params.id)
      const user = await User.findByPk(editId)
      if (!user || user.role === 'admin') throw new Error("User didn't exist!")
      if (userId !== editId) throw new Error('Only allow edit your own account')
      const { files } = req
      const avatar = files?.avatar ? await imgurFileHandler(files.avatar[0]) : user.avatar
      const cover = files?.cover ? await imgurFileHandler(files.cover[0]) : user.cover

      const editedUser = await user.update({
        name,
        introduction,
        avatar,
        cover
      })
      delete editedUser.password
      res.json({
        status: 'success',
        data: {
          user: editedUser
        }
      })
    } catch (err) {
      next(err)
    }
  },
  putUserAccount: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account || !name || !email || !password || !checkPassword) throw new Error('account, name, email, password, checkPassword is require!')
      const userId = Number(helpers.getUser(req).id)
      const editId = Number(req.params.id)
      const user = await User.findByPk(editId)
      if (!user || user.role === 'admin') throw new Error("User didn't exist!")
      if (userId !== editId) throw new Error('只能修改自己的資料！')
      if (password !== checkPassword) throw new Error('Password do not match!')
      const userAccountExisted = await User.findOne({
        where: {
          account,
          id: { [Op.ne]: editId }
        }
      })
      if (userAccountExisted) throw new Error('Account already exists!')
      const userEmailExisted = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: editId }
        }
      })
      if (userEmailExisted) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(password, await bcrypt.genSalt(10))
      const editedUser = await user.update({
        account,
        name,
        email,
        password: hash,
        role: 'user'
      })
      delete editedUser.password
      res.json({
        status: 'success',
        data: {
          editedUser
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
