const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ensureAuthenticated } = require('../helpers/auth-helper')
const { User } = require("../models");

const userController = {
  signUp: async (req, res, next) => {
    const { name, account, email, password, passwordConfirm } = req.body;
    try {
      if (!name || !account || !email || !password) {
        const error = new Error("欄位不可空白!");
        error.status = 400;
        throw error;
      }
      if (password !== passwordConfirm) {
        const error = new Error("密碼與確認密碼不符!");
        error.status = 400;
        throw error;
      }
      const [isEmailExist, isAccountExist] = await Promise.all([
        User.findOne({ where: { email } }),
        User.findOne({ where: { account } }),
      ]);
      if (isEmailExist) {
        const error = new Error("email 已重複註冊！");
        error.status = 400;
        throw error;
      }
      if (isAccountExist) {
        const error = new Error("account 已重複註冊！");
        error.status = 400;
        throw error;
      }
      const newUser = await User.create({
        name,
        account,
        email,
        password,
      });
      return res.json({
        status: "success",
        data: newUser,
      });
    } catch (error) {
      return next(error);
    }
  },
  signIn: async (req, res, next) => {
    const { account, password } = req.body;
    try {
      const foundUser = await User.findOne({ where: { account } });
      if (!foundUser) {
        const error = new Error("帳號不存在!");
        error.status = 404;
        throw error;
      }
      const isMatch = await bcrypt.compare(password, foundUser.password);
      if (!isMatch) {
        const error = new Error("密碼不正確!");
        error.status = 400;
        throw error;
      }
      const user = {
        ...foundUser.toJSON(),
        isAuthenticated: ensureAuthenticated(req)
      }
      delete user.password;
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      return res.json({
        status: "success",
        data: {
          token,
          user
        },
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = userController;
