const passport = require("../config/passport")
const helpers = require("../_helpers")

const authenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user)
      return res.status(401).json({ status: "error", message: "未經授權ar2vr" })
    req.user = user
    next()
  })(req, res, next)
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === "admin")
    return next()
  return res.status(403).json({ status: "error", message: "未經允許無法使用!" })
}
const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === "user")
    return next()
  return res.status(403).json({ status: "error", message: "未經允許無法使用!" })
}
const authCurrentUser = (req, res, next) => {
  if (helpers.getUser(req).id === Number(req.params.id)) return next()
  return res
    .status(403)
    .json({ status: "error", message: "使用者只能編輯自己的資訊!" })
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser,
  authCurrentUser,
}
