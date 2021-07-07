const cors = require('cors')

module.exports = () => {
  const whiteList = process.env.CORS_WHITE_LIST.split(',')
  const corsOptionsDelegate = (req, callback) => {
    if (whiteList.indexOf(req.header('Origin')) !== -1) {
      return callback(null, { origin: true })
    }
    return callback(null, { origin: false })
  }
  return cors(corsOptionsDelegate)
}
