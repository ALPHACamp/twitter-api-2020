const CORSHeader = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.front_end_web_url)
  res.header('Access-Control-Allow-Headers', 'content-type')
  res.header('Access-Control-Allow-Methods', 'PUT', 'DELETE', 'OPTIONS')
  res.header('Access-Control-Max-Age', 600)
  next()
}

module.exports = {
  CORSHeader
}
