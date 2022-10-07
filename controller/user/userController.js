const { User } = require('../../models')
const assert = require('assert')
const { multerFilesHandler } = require('../../helper/file-helper')
const bcrypt = require('bcryptjs')
module.exports = {
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        raw: true,
        nest: true
      })
      res.json(user)
    } catch (error) {
      next(error)
    }
  },
  putUser: async (req, res, next) => {
    const userId = req.params.id
    const { account, name, email, password, introduction } = req.body
    const { files } = req

    try {
      const cover = await multerFilesHandler(files.cover[0])
      const avatar = await multerFilesHandler(files.avatar[0])
      console.log('cover', cover, 'response2', avatar)

      const user = await User.findByPk(userId)
      assert(user, '使用者不存在')
      const [accountCheck, emailCheck] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      assert(!accountCheck, '帳號已存在')
      assert(!emailCheck, '這個email已被使用')
      assert(!(introduction.length > 160), '自我介紹超過字數上限')
      assert(!(name.length > 50), '暱稱超過字數上限')

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
  },
  userTest: (req, res, next) => {
    res.json({
      message: 'here is user '
    })
  }
}
