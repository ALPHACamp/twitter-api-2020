
function getUser(req) {
  return req.user;
}

function setUser(req, user) {
  req.user = user
}

function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

module.exports = {
  getUser,
  setUser,
  ensureAuthenticated
};