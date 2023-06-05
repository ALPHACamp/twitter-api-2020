const passport = require("../config/passport");
const helpers = require("../_helpers");
module.exports = {
  //登入驗證
  authenticated: (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
      if (err || !user)
        return res
          .status(401)
          .json({ status: "error", message: "unauthorized" });
      req.user = user;
      return next();
    })(req, res, next);
  },
  //前台User登入驗證
  authenticatedUser: (req, res, next) => {
    req.user = helpers.getUser(req);
    if (req.user.role !== "admin") {
      return next();
    }
    return res.status(403).json({
      status: "error",
      message: "Permission deneid, it's only for user!",
    });
  },
  //後台admin登入驗證
  authenticatedAdmin: (req, res, next) => {
    req.user = helpers.getUser(req);
    if (req.user.role === "admin") {
      return next();
    }
    return res.status(403).json({
      status: "error",
      message: "Permission denied, it's only for admin.",
    });
  },
};
