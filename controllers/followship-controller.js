
const { User, Followship } = require('../models')
const authHelpers = require('../_helpers')

const followshipController = {
  postFollowships: (req, res, next) => {

    const loginUserId = authHelpers.getUserId(req)
    const targetUserId = req.body.followingId
    const error = new Error()
    // 不允許追蹤自己
    if (loginUserId === targetUserId) {
      error.code = 403
      error.message = '使用者不允許追蹤自己'
      return next(error)
    }


  }
}

exports = module.exports = followshipController
