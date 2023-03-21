const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const { User } = require("../models");

// - JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
passport.use(new JWTStrategy(jwtOptions), async (jwt_payload, done) => {
  try {
    const foundUser = await User.findByPk(jwt_payload.id);

    if (!foundUser) return done(null, false);

    return done(null, foundUser);
  } catch (error) {
    return done(error, null);
  }
});

// - Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "account" },
    async (account, password, done) => {
      try {
        const foundUser = await User.findOne({ where: { account } });

        if (!foundUser) return done(null, false);

        const isMatch = await bcrypt.compare(password, foundUser.password);

        if (!isMatch) return done(null, false);

        return done(null, foundUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
