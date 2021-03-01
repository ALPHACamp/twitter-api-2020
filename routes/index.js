let apis = require('./apis')

module.exports = (app) => {
  qpp.use('/api', apis)
}