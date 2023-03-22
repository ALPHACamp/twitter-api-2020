const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUser, ensureAuthenticated } = require("../helpers/auth-helper");
const { User } = require("../models");

const userController = {
  signUp: async (req, res, next) => {
    const { name, account, email, password, checkPassword } = req.body;
    try {
      if (!name || !account || !email || !password || !checkPassword) {
        const error = new Error("欄位不可空白!");
        error.status = 400;
        throw error;
      }
      if (password !== checkPassword) {
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
      const user = await User.create({
        name,
        account,
        email,
        password: bcrypt.hashSync(password, 10),
      });
      const foundUser = await User.findByPk(user.id);
      const newUser = {
        ...foundUser.toJSON(),
        isAuthenticated: ensureAuthenticated(req),
      };
      delete newUser.password;
      return res.json({
        status: "success",
        data: {
          newUser,
        },
      });
    } catch (error) {
      return next(error);
    }
  },
  signIn: async (req, res, next) => {
    const { account, password } = req.body;
    try {
      if (!account || !password) {
        const error = new Error("欄位不可空白!");
        error.status = 400;
        throw error;
      }
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
      const loginUser = {
        ...foundUser.toJSON(),
        isAuthenticated: ensureAuthenticated(req),
      };
      delete loginUser.password;
      const token = jwt.sign(loginUser, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      return res.json({
        status: "success",
        data: {
          token,
          loginUser,
        },
      });
    } catch (error) {
      return next(error);
    }
  },
  putUser: async (req, res, next) => {
    const { id } = req.params
    const { name, introduction, avatar, cover } = req.body
    try {
      if (introduction.length > 160 || name.length > 50) {
        const error = new Error("字數超出上限！");
        error.status = 400;
        throw error;
      }
      if (getUser(req).id !== Number(id)) {
        const error = new Error("無法更改他人資料!");
        error.status = 401;
        throw error;
      }
      const foundUser = await User.findByPk(id)
      if (!foundUser) {
        const error = new Error("使用者不存在!");
        error.status = 404;
        throw error;
      }
      const updatedUser = await foundUser.update({
        name,
        introduction
      })
      const userData = {
        ...updatedUser.toJSON(),
        isAuthenticated: ensureAuthenticated(req)
      }
      return res.json({
        status: "success",
        data: {
          updatedUser: userData
        }
      })
    } catch (error) {
      return next(error)
    }
  }
};

module.exports = userController;
