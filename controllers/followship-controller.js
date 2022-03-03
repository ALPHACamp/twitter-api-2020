const helpers = require('../_helpers')
const { Followship, User } = require('../models')

const followshipController = {
  // 新增追隨者
  postFollowUser: (req, res, next) => {
    // 取得登入者、表單followingId
    const currentUser = helpers.getUser(req)
    const { id } = req.body

    // 檢查followingId非登入者
    if (currentUser.id === Number(id)) throw new Error('不可追隨自已!')

    return User.findByPk(id, { attributes: ['id'] })
      .then(user => {
        // 檢查followingId使用者是否存在
        if (!user) return res.json({ status: 'error', message: '使用者不存在!'})

        // 查詢條件資料是否存在，沒有在新增資料
        return Followship.findOrCreate({
          where: {
            followerId: currentUser.id,
            followingId: id
          }
        })
      })
      .then(() => {
        res.json({ status: 'success', message: '成功追隨使用者' })
      })
      .catch(err => next(err))
  },

  // 取消追蹤
  deleteFollowUser: (req, res, next) => {
    // 刪除資料
    Followship.destroy({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.followingId
      }
    })
      .then(res.json({ status: 'success', message: '已成功取消追隨使用者' }))
      .catch(err => next(err))
  }
}

module.exports = followshipController