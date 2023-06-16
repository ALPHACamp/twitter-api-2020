const CORSHeader = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://ywcheng1207.github.io/')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS')
  }
  return next()
}

module.exports = {
  CORSHeader
}
