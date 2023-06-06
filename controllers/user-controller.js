const bcrypt = require("bcryptjs");
const { User, Followship } = require("../models");
const jwt = require("jsonwebtoken");
const { getUser } = require("../_helpers");
const sequelize = require("sequelize");
const { imgurFileHandler } = require("../helpers/file-helpers");

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
  getUserProfile: (req, res, next) => {
    const id = req.params.id || getUser(req).dataValues.id;
    return User.findByPk(id, {
      raw: true,
      nest: true,
      attributes: {
        include: [
          [
            sequelize.literal(
              "(SELECT COUNT(DISTINCT id) FROM Followships WHERE Followships.following_id = user.id)"
            ),
            "follower",
          ],
          [
            sequelize.literal(
              "(SELECT COUNT(DISTINCT id) FROM Followships WHERE Followships.follower_id = user.id)"
            ),
            "following",
          ],
          [
            sequelize.literal(
              "(SELECT COUNT(id) FROM Tweets WHERE Tweets.user_id = user.id)"
            ),
            "tweetAmount",
          ],
        ],
        exclude: ["password", "createdAt", "updatedAt"],
      },
    })
      .then((user) => {
        if (!user) throw new Error("帳號不存在！");
        if (user.role === "admin") throw new Error("帳號不存在！");
        res.status(200).json(user);
      })
      .catch((err) => next(err));
  },
  putUserProfile: (req, res, next) => {
    const userId = Number(req.params.id);
    const { name, introduction, avatar, cover } = req.body;
    if (!name) throw new Error("name is required!");
    if (getUser(req).id !== userId) throw new Error("permission denied");
    return User.findByPk(userId)
      .then((user) => {
        if (!user) throw new Error("帳號不存在！");
        return user.update({
          name,
          introduction,
          avatar: avatar ? avatar : user.avatar,
          cover: cover ? cover : user.cover,
        });
      })
      .then((updatedUser) => res.status(200).json({ user: updatedUser }))
      .catch((err) => next(err));
  },
};
module.exports = userController;
