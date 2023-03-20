const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// set the local strategy
passport.use(
  new LocalStrategy({
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true,
  }),
  async (req, account, password, cb) => {
    try {
      const user = await User.findOne({ where: { account, password } });

      if (!user) {
        return cb(null, false, { message: 'This account is not registered!' });
      }

      const res = bcrypt.compare(password, user.password);

      if (!res) {
        return cb(null, false, { message: 'Account or password is incorrect' });
      }

      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
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
          { model: User, as: 'Following' },
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

// set serialize and deserialize
passport.serializeUsers((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
    });

    cb(null, user.toJSON());
  } catch (err) {
    cb(err);
  }
});

module.exports = passport;
