function getUser(req) {
  return req.user;
}

function ensureAuthenticated(req) {
  return req.isAuthenticated()
}

module.exports = {
  getUser,
  ensureAuthenticated
};