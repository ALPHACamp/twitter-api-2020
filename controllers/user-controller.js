const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUser } = require('../_helpers');
const { User, Tweet, Reply, Like, FollowShip } = require('../models');
const { imgurFileHandler } = require('../helpers/file-helpers');

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
  getUser: async (req, res, next) => {
    try {
      const UserId = req.params.id;
      const user = await User.findOne({
        where: { id: UserId },
        include: [
          {
            model: User,
            as: 'Followers',
            attributes: ['id', 'account', 'avatar', 'name'],
          },
          {
            model: User,
            as: 'Followings',
            attributes: ['id', 'account', 'avatar', 'name'],
          },
        ],
        attributes: { exclude: ['password'] },
      });

      const tweets = await Tweet.findAll({
        where: { UserId },
        order: [['createdAt', 'DESC']],
      });
      const replies = await Reply.findAll({
        where: { UserId },
        order: [['createdAt', 'DESC']],
      });
      const likes = await Like.findAll({
        where: { UserId },
        order: [['createdAt', 'DESC']],
      });

      if (!user) {
        throw new Error('User not found');
      }

      res.status(200).json({ user, tweets, replies, likes });
    } catch (err) {
      err.status = 400;
      next(err);
    }
  },
  editUserSetting: async (req, res, next) => {
    try {
      const UserId = req.params.id;
      const currentId = getUser(req).id;
      const { account, name, email, password, checkPassword } = req.body;

      const user = await User.findByPk(UserId);
      if (!user) {
        throw new Error('User not found');
      }

      if (currentId !== user.id) {
        throw new Error('You are not authorized to edit this user');
      }

      if (!account || !name || !email || !password || !checkPassword) {
        throw new Error('All fields are required');
      }

      if (account !== user.account) {
        if (await User.findOne({ where: { account } })) {
          throw new Error('This account already exists');
        }
      }

      if (email !== user.email) {
        if (await User.findOne({ where: { email } })) {
          throw new Error('This email already exists');
        }
      }

      if (name.length > 50) {
        throw new Error('Name is longer than 50 characters');
      }
      if (password !== checkPassword) {
        throw new Error('Passwords do not match');
      }

      const userUpdated = await user.update({
        account,
        name,
        email,
        password: password ? bcrypt.hashSync(password, 10) : password,
      });

      res.status(200).json({
        status: 'success',
        message: 'User is updated successfully',
        userUpdated: {
          account: userUpdated.account,
          name: userUpdated.name,
          email: userUpdated.email,
        },
      });
    } catch (err) {
      err.status = 400;
      next(err);
    }
  },
  editUserProfile: async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
