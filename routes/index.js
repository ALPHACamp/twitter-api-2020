const apis = require('./api.js')

module.exports = (app) => {
  app.get('/api', apis)
}