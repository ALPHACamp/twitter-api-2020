// 載入所需套件
const followshipService = require('../services/followshipService')

const followshipController = {
  postFollowship: async (req, res) => {
    try {
      await followshipService.postFollowship(req, res, data => {
        return res.json(data)
      })
    } catch (err) {
      return res.status(400).json({ status: err.name, message: err.message })
    }
  },

  deleteFollowship: (req, res) => {
    followshipService.deleteFollowship(req, res, data => {
      return res.json(data)
    })
  },
}

// followshipService exports
module.exports = followshipController