const bcrypt = require('bcryptjs');
const helpers = require('../../_helpers');
const db = require('../../models');
const User = db.User;
const Op = require('sequelize').Op;

// JWT
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

let userController = {
  signUp: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body;
    if (!account || !name || !email || !password) {
      return res.json({ status: 'error', message: '所有欄位為必填' });
    }
    if (checkPassword !== password) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同！' });
    } else {
      User.findOne({ where: { [Op.or]: [{ account }, { email }] } })
        .then((user) => {
          console.log('user~~~', user);
          if (user) {
            if (user.email === email) {
              return res.json({ status: 'error', message: 'email已被註冊' });
            } else if (user.account === account) {
              return res.json({ status: 'error', message: 'account已被註冊' });
            }
          } else {
            return User.create({
              name,
              email,
              account,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
              role: 'user',
            });
          }
        })
        .then((user) => {
          res.json({ status: 'success', message: '成功註冊帳號!' });
        })
        .catch((error) => res.send(error));
    }
  },

  signIn: (req, res) => {
    if (!req.body.account || !req.body.password) {
      return res.json({ status: 'error', message: "required fields didn't exist" });
    }

    const account = req.body.account;
    const password = req.body.password;

    User.findOne({ where: { account } })
      .then((user) => {
        if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' });
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ status: 'error', message: 'passwords did not match' });
        }

        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        return res.json({
          status: 'success',
          message: 'ok',
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            account: user.account,
            role: user.role,
          },
        });
      })
      .catch((error) => res.send(error));
  },

  getCurrentUser: (req, res) => {
    const user = helpers.getUser(req);
    return res.json(user);
  },

  getUser: (req, res) => {
    const id = req.params.id;
    User.findByPk(id).then((user) => {
      return res.json(user);
    });
  },
  //回傳"使用者跟隨"的人數,ID
  getFollowing: (req, res) => {
    return Followship.findAndCountAll({
      raw: true,
      nest: true,
      where: {
        followerId: req.user.id,
      },
    }).then((results) => {
      //result.count  //result.rows
      res.json({ results: results, status: 'success', message: '123' });
    });
  },
  //回傳"跟隨使用者"的人數,ID
  getFollower: (req, res) => {
    return Followship.findAndCountAll({
      raw: true,
      nest: true,
      where: {
        followingId: req.user.id,
      },
    }).then((results) => {
      //result.count  //result.rows
      res.json({ results: results, status: 'success', message: '123' });
    });
  },
};

module.exports = userController;
