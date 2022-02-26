
function getUser(req) {
  return req.user;
}

const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

module.exports = {
  getUser,
 ensureAuthenticated 
};