function getUser (req) {
  console.log(req.body)
  return req.user
}

module.exports = {
  getUser
}
