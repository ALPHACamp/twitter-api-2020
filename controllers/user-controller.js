const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const imgurFileHandler = require("../helpers/file-helper");
const { getUser } = require("../helpers/auth-helper");
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
      const newUser = foundUser.toJSON();
      delete newUser.password;
      return res.json({
        status: "success",
        data: { newUser },
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
      const loginUser = foundUser.toJSON();
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
    const { id } = req.params;
    const { name, introduction } = req.body;
    // - 若有傳任一張圖片 req.files 才存在
    const avatar = req.files?.avatar; 
    const cover = req.files?.cover;
    const avatarFile = avatar ? avatar[0] : null;
    const coverFile = cover ? cover[0] : null;
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
      const [foundUser, avatarLink, coverLink] = await Promise.all([
        User.findByPk(id),
        imgurFileHandler(avatarFile),
        imgurFileHandler(coverFile),
      ]);
      if (!foundUser) {
        const error = new Error("使用者不存在!");
        error.status = 404;
        throw error;
      }
      const data = await foundUser.update({
        name,
        introduction,
        avatar: avatarLink || foundUser.avatar,
        cover: coverLink || foundUser.cover,
      });
      const updatedUser = data.toJSON();
      delete updatedUser.password;
      return res.json({
        status: "success",
        data: { updatedUser },
      });
    } catch (error) {
      return next(error);
    }
  },
  putUserSetting: (req, res, next) => {

  }
};

module.exports = userController;
