const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportJWT = require('passport-jwt');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// set the local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'account',
      passwordField: 'password',
    },
    async (req, account, password, cb) => {
      try {
        const user = await User.findOne({ where: { account, password } });

        if (!user) {
          return cb(null, false, {
            message: 'This account is not registered!',
          });
        }

        const res = bcrypt.compare(password, user.password);

        if (!res) {
          return cb(null, false, {
            message: 'Account or password is incorrect',
          });
        }

        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

// set the jwt strategy
const jstOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JWTStrategy(jstOptions, async (jwtpayload, cb) => {
    try {
      const user = await User.findByPk(jwtpayload.id, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
        ],
      });
      if (!user) {
        return cb(null, false, { message: 'Account or password is incorrect' });
      }

      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  })
);

module.exports = passport;
