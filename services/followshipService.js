// 載入所需套件
const { Followship } = require('../models')
const { Op } = require('sequelize')
const helpers = require('../_helpers')

const followshipService = {
  postFollowship: async (req, res, callback) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = req.body.id
      
      //使用者不能追蹤自己
      if (followerId === Number(followingId)) {
        return callback({ status: 'error', message: '不能追蹤自己' })
      }
      //不能重複追蹤他人
      const followship = await Followship.findOne({ where: { [Op.and]: [{ followerId }, { followingId }] } })

      if (followship) {
        return callback({ status: 'error', message: '不能重複追蹤' })
      } else {
        await Followship.create({
          followerId,
          followingId
        })
        return callback({ status: 'success', message: '成功追蹤' })
      }
    } catch (err) {
      console.log(err)
    }
  }
}


// followshipController exports
module.exports = followshipService
