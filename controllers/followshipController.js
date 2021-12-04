// 載入所需套件
const followshipService = require('../services/followshipService')

const followshipController = {
  postFollowship: (req, res) => {
    followshipService.postFollowship(req, res, data => {
      return res.json(data)
    })
  }
}

// followshipService exports
module.exports = followshipController