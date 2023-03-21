const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUser } = require('../_helpers');
const { User, Tweet, Reply, Like, FollowShip } = require('../models');

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body;

      if (!account || !name || !email || !password || !checkPassword) {
        throw new Error('All fields are required');
      }

      if (password !== checkPassword) {
        throw new Error('Passwords do not match');
      }

      if (await User.findOne({ where: { account } })) {
        throw new Error('This account already exists');
      }

      if (await User.findOne({ where: { email } })) {
        throw new Error('This email already exists');
      }

      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, 10),
      });

      res.status(200).json({ message: 'User is registered successfully' });
    } catch (err) {
      err.status = 400;
      next(err);
    }
  },
  signIn: async (req, res, next) => {
    try {
      const userData = getUser(req).toJSON();

      delete userData.password;

      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      res
        .status(200)
        .json({ status: 'success', data: { token, user: userData } });
    } catch (err) {
      err.status = 400;
      next(err);
    }
  },
};

module.exports = userController;
