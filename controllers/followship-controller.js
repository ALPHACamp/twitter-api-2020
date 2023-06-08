const db = require('../models')
const { Followship, User } = db
const helpers = require('../_helpers')

const followshipController = {

  postFollowship: async (req, res, next) => {
    try {
      // 確認要追隨的人存不存在 (不能追隨管理者跟自己)
      const followerId = helpers.getUser(req).id.toString()
      const followingId = req.body.id

      if (!followingId) throw new Error('請輸入要追隨人的id!')
      if (followerId === followingId) throw new Error('不能追隨自己!')

      const following = await User.findByPk(followingId, {
        where: { role: 'user' }
      })
      if (!following) throw new Error('你要追隨的使用者不存在！')

      // 確認沒有這個followship
      const followship = await Followship.findOne({
        where: { followerId, followingId }
      })
      if (followship) throw new Error('已經在追隨這個使用者了！')

      // 建立兩人關西
      await Followship.create({ followerId, followingId })
      res.json({
        status: 'success',
        message: '成功追隨使用者！'
      })
    } catch (error) {
      next(error)
    }
  },
  deleteFollowship: async (req, res, next) => {
    try {
      // 確認沒有這個followship
      const followshipId = req.params.followshipId
      const followship = await Followship.findOne({ where: { id: followshipId } })
      if (!followship) throw new Error('Followship不存在！')

      // 刪除
      await followship.destroy()
      res.json({
        status: 'success',
        message: '成功刪除Followship！'
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = followshipController
