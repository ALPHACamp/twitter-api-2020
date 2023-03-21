const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const { User } = require("../models");

// - JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
passport.use(
  new JWTStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      const foundUser = await User.findByPk(jwt_payload.id);

      if (!foundUser) return done(null, false);

      return done(null, foundUser);
    } catch (error) {
      return done(error, null);
    }
  })
);

module.exports = passport;
