const cors = require('cors')

module.exports = () => {
  const whiteList = ['http://localhost:8080']
  const corsOptionsDelegate = (req, callback) => {
    if (whiteList.indexOf(req.header('Origin')) !== -1) {
      return callback(null, { origin: true })
    }
    return callback(null, { origin: false })
  }
  return cors(corsOptionsDelegate)
}
