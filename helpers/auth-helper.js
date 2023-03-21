const helpers = {
  getUser: (req) => {
    return req.user || null
  }
}

module.exports = helpers