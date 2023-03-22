
function getUser (req) {
  return req.user.toJSON() || null
}

module.exports = {
  getUser
}
