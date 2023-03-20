const { Tweet } = require('../models')
const adminController = {
  getTweet: async (req, res, next) => {
    res.json({ data: { test: '測試' } })
  }
}
module.exports = adminController
