const bcrypt = require("bcryptjs");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { getUser } = require("../_helpers");

const userController = {
  signUp: (req, res, next) => {
    const { name, account, email, password, checkPassword } = req.body;
    // Error: 密碼不相符
    if (password !== checkPassword) throw new Error("Passwords do not match");
    // Error: 必填項目
    if (!account || account.trim() === "") throw new Error("帳號為必填項目");
    if (!email || email.trim() === "") throw new Error("Email為必填項目");
    if (!password || password.trim() === "") throw new Error("密碼為必填項目");
    // Error: 字數限制
    // 待設定password, name, account
    return User.findAll({
      $or: [{ where: { account } }, { where: { email } }],
    })
      .then((users) => {
        if (users.some((u) => u.email === email))
          throw new Error("email已重複註冊");
        if (users.some((u) => u.account === account))
          throw new Error("account已重複註冊");
        return bcrypt.hash(password, 10);
      })
      .then((hash) => {
        return User.create({
          name,
          account,
          email,
          password: hash,
          role: "user",
        });
      })
      .then((newUser) => {
        const user = newUser.toJSON();
        delete user.password;
        return res.status(200).json(user);
      })
      .catch((err) => next(err));
  },
  signIn: (req, res, next) => {
    const { account, password } = req.body;
    if (!account || !password)
      throw new Error("Account and password is required");
    return User.findOne({
      where: { account },
    })
      .then((user) => {
        if (!user) throw new Error("使用者不存在");
        if (user.role === "admin") throw new Error("使用者不存在");
        if (!bcrypt.compareSync(password, user.password))
          throw new Error("密碼不相符");
        const userData = user.toJSON();
        delete userData.password;
        const token = jwt.sign(userData, process.env.JWT_SECRET, {
          expiresIn: "30d",
        });
        return res.status(200).json({
          token,
          user: userData,
        });
      })
      .catch((err) => next(err));
  },
  getUserProfile: (req, res, next) => {},
  putUserProfile: (req, res, next) => {},
};

module.exports = userController;
