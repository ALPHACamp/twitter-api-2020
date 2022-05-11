function getUser (req) {
  return req.user.toJSON()
}

module.exports = {
  getUser
}
