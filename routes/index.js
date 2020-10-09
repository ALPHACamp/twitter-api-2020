const apis = require('./api.js')

module.exports = (app) => {
  app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))
  app.use('/api', apis)
}