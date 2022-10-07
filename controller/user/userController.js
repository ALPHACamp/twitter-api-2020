const { User } = require('../../models')
const assert = require('assert')
const { multerFilesHandler } = require('../../helper/file-helper')
const bcrypt = require('bcryptjs')
const { userValidation } = require('../../helper/validations')
module.exports = {
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
      // 對輸入的資料做檢查
      if (error) throw new Error(error.details[0].message)
      const { account, name, email, password, introduction } = value
      console.log(
        'account, name, email, password, introduction',
        account,
        name,
        email,
        password,
        introduction
      )
      // 將圖片上傳至第三方圖庫
      // 若沒有傳入照片回傳null
      // console.log(Object.keys(files).length === 0)
      console.log(files?.cover)
      const cover = await multerFilesHandler(
        files?.cover ? files.cover[0] : null
      )
      const avatar = await multerFilesHandler(
        files.avatar ? files.avatar[0] : null
      )
      const user = await User.findByPk(userId)
      assert(user, '使用者不存在')
      // 確認 account 、 email 是否重複
      const [accountCheck, emailCheck] = await Promise.all([
        User.findOne({ where: { account }, attributes: ['id'] }),
        User.findOne({ where: { email }, attributes: ['id'] })
      ])
      if (accountCheck && accountCheck.id !== user.id) {
        throw new Error('帳號已存在')
      }
      if (emailCheck && emailCheck.id !== user.id) {
        throw new Error('這個email已被使用')
      }
      const updatedUser = await user.update({
        account,
        name,
        email,
        introduction,
        password: await bcrypt.hash(password, 10),
        cover,
        avatar
      })
      res.json({
        status: 'success',
        data: updatedUser
      })
    } catch (error) {
      next(error)
    }
  }
}
