const passport = require("passport");

const authenticatedUser = (req, res, next) => {
  // - 使用 jwt 驗證
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (error || !user || user.isAdmin) {
      return res.status(401).json({ status: "error", message: "unauthorized" });
    }
    req.user = user.dataValues;
    next();
  })(req, res, next);
};

const authenticatedAdmin = (req, res, next) => {
  // - 使用 jwt 驗證
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (error || !user || user.role === "user") {
      return res
        .status(403)
        .json({ status: "error", message: "permisson denied" });
    }
    req.user = user.dataValues;
    next();
  })(req, res, next);
};


module.exports = {
  authenticatedUser,
  authenticatedAdmin,
};
