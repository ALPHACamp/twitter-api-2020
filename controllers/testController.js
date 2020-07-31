const helpers = require('../_helpers.js')

const testController = {
  getTestData: (req, res) => {
    return res.json({ status: 'success', message: '我是測試資料', user: helpers.getUser(req).name })
  },
}

module.exports = testController
