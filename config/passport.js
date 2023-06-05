const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const { User } = require("../models");

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
    try {
      const user = await User.findByPk(jwtPayload.id, {
        include: [
          { model: User, as: "Followers" },
          { model: User, as: "Followings" },
        ],
      });
      if (user) {
        cb(null, user);
      } else {
        cb(null, false);
      }
    } catch (err) {
      cb(err, false);
    }
  })
);
module.exports = passport;
