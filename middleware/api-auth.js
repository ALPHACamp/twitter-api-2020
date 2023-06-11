const passport = require("../config/passport");
const helpers = require("../_helpers");
const { User } = require("../models");
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
      message: "Permission denied, it's only for user!",
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

  checkPermission: (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Invalid authorization header' });
    }
    const authToken = authHeader.split(' ')[1];
    try {s
      // verify authtoken
      const decodedToken = jwt.verify(authToken, 'password');

      // get user id from decoded token
      const userId = decodedToken.userId;
      const user = User.find((user) => user.id === userId);
      if (!user) {
        return res.status(403).json({ message: 'Insufficient permission' });
      }
      // verified user
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
};
