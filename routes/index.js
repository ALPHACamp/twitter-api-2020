const apis = require('./api.js')

module.exports = (app) => {
  app.get('/', (req, res) => res.send('Hello World'))
  app.get('/users/chatting', (req, res) => {res.sendFile(__dirname + '/index.html')})
  app.use('/api', apis)
}