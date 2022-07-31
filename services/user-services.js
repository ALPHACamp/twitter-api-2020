const db = require('../models')
const { User } = db
const bcrypt = require('bcryptjs')
const { Op } = require("sequelize")
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userServices = {
  signUp: (req, cb) => {
    // if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
    // if (req.body.name && req.body.name.length > 50) throw new Error('名稱不可超過５０字')
    // Promise.all([
    //   User.findOne({ where: { email: req.body.email } }),
    //   User.findOne({ where: { account: req.body.account } })
    // ])
    //   .then(([foundEmail, foundAccount]) => {
    //     // !有餘力再來優化程式
    //     let errorMessage = []
    //     if (foundEmail) {
    //       errorMessage += 'email 已重複註冊！'
    //     }
    //     if (foundAccount) {
    //       errorMessage += 'account 已重複註冊！'
    //     }
    //     if (errorMessage.length > 0) {
    //       throw new Error(errorMessage)
    //     }
    //     return bcrypt.hash(req.body.password, 10)
    //   })
    //   .then(hash =>
    //     User.create({
    //       account: req.body.account,
    //       name: req.body.name,
    //       email: req.body.email,
    //       password: hash,
    //       role: 'user'
    //     }))
    //   .then(newUser => cb(null, { user: newUser }))
    //   .catch(err => cb(err))
  }, getUser: (req, cb) => {
    // const id = req.params.id
    // User.findByPk(id, {
    //   attributes: {
    //     exclude: ['password']
    //   }
    // })
    //   .then(user => {
    //     if (!user) throw new Error("user doesn't exist!")
    //     return cb(null, { user })
    //   })
    //   .catch(err => cb(err))
  }, editUser: async (req, cb) => {
    // const currentUserId = helpers.getUser(req).id
    // const { account, name, email, password, checkPassword, introduction } = req.body
    // const id = req.params.id
    // const avatarImg = req.files.avatar ? req.files.avatar : []
    // const coverImg = req.files.cover ? req.files.cover : []
    // try {
    //   if (Number(currentUserId) !== Number(id)) throw new Error('無法修改其他使用者之資料!')
    //   if (!account || !name || !email || !password || !checkPassword) throw new Error('必填欄位不可空白!')
    //   if (password !== checkPassword) throw new Error('Passwords do not match!')
    //   const user = await User.findByPk(id)
    //   if (!user) throw new Error("user doesn't exist!")

    //   const foundEmail = await User.findOne({
    //     where: {
    //       email,
    //       [Op.not]: [{ id }]
    //     }
    //   })
    //   const foundAccount = await User.findOne({
    //     where: {
    //       account,
    //       [Op.not]: [{ id }]
    //     }
    //   })
    //   let errorMessage = []
    //   if (foundEmail) {
    //     errorMessage += 'email 已重複註冊！'
    //   }
    //   if (foundAccount) {
    //     errorMessage += 'account 已重複註冊！'
    //   }
    //   if (errorMessage.length > 0) {
    //     throw new Error(errorMessage)
    //   }
    //   const newPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    //   const avatarFile = await imgurFileHandler(...avatarImg)
    //   const coverFile = await imgurFileHandler(...coverImg)

    //   return user.update({
    //     account, name, email, introduction,
    //     password: newPassword,
    //     avatar: avatarImg || user.avatar,
    //     cover: coverImg || user.cover
    //   })



    // } catch (err) {
    //   cb(err)
    // }
    // return Promise.all([
    //   User.findByPk(id),
    //   User.findOne({
    //     where: {
    //       email,
    //       [Op.not]: [{ id }]
    //     }
    //   }),
    //   User.findOne({
    //     where: {
    //       account,
    //       [Op.not]: [{ id }]
    //     }
    //   }),
    //   imgurFileHandler(...avatarImg),
    //   imgurFileHandler(...coverImg)
    // ])
    //   .then(([user, foundEmail, foundAccount, avatarImg, coverImg]) => {
    //   if (!user) throw new Error("user doesn't exist!")
    //   // !有餘力再來優化程式
    //   let errorMessage = []
    //   if (foundEmail) {
    //     errorMessage += 'email 已重複註冊！'
    //   }
    //   if (foundAccount) {
    //     errorMessage += 'account 已重複註冊！'
    //   }
    //   if (errorMessage.length > 0) {
    //     throw new Error(errorMessage)
    //   }
    //   const newPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    //   return [user, newPassword, avatarImg, coverImg]
    // })
    // .then(([user, newPassword, avatarImg, coverImg]) => {
    //   return user.update({
    //     account, name, email, introduction,
    //     password: newPassword,
    //     avatar: avatarImg || user.avatar,
    //     cover: coverImg || user.cover
    //   })
    // })
    // .then(updatedUser => {
    //   cb(null, { user: updatedUser })
    // })

    // .catch(err => cb(err))
  }
}

module.exports = userServices
