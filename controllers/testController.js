const testController = {
  getTestData: (req, res) => {
    return res.json({ status: 'success', message: '我是測試資料' })
  },

  getNewTest: (req, res) => {
    res.send('test')
  }
}

module.exports = testController
