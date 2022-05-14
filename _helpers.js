function getUser (req) {
  return req.user || null
}

module.exports = {
  getUser
}
