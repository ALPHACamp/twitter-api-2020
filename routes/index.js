const apis = require('./api.js')

module.exports = (app) => {
  app.use('/api', apis)
}