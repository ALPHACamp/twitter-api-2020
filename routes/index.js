let apis = require('./api')

module.exports = (app) => {
  app.get('/', (req, res) => res.send('Hello World!'))
  app.use('/api', apis)
}