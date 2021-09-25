const db = require('../models')
const { Subscribeship, User } = db

const subscribeshipService = {
  subscribeUser: async (req, res, cb) => {
    try {
      const targetId = req.body.id
      const loginUserId = req.user.id
      // 驗證
      if (targetId == loginUserId) return cb({ status: '400', message: '不能訂閱自己' })
      const target = await User.findByPk(targetId)
      if (target === null) return cb({ status: '400', message: '用戶不存在，無法訂閱' })
      // 訂閱他人
      let [subscribeship, isCreateNow] = await Subscribeship.findOrCreate({
        attributes: ['id'],
        where: {
          subscriberId: loginUserId,
          subscribingId: targetId,
        },
        defaults: {
          subscriberId: loginUserId,
          subscribingId: targetId,
        }
      })

      if (!isCreateNow) return cb({ status: '400', message: '不能重複訂閱同一使用者' })

      return cb({ status: '200', message: '訂閱成功' })
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  }


  // unsubscribeUser:
}

module.exports = subscribeshipService