const apis = require('./apis.js')

module.exports = (app) => {
  app.use('/api', apis)

  app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ error: '500 - Server Error' })
  })
}
