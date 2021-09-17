const apis = require('./apis')

module.exports = (app) => {
  app.use('/api', apis)
  
  // 錯誤處理
  app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ error: '500 - Server Error' })
  })
}
