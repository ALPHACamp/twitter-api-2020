let apis = require('./api')

module.exports = (app) => {
  app.use('/api', apis)
}