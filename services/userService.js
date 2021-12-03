const bcrypt = require("bcryptjs");
const imgur = require("imgur-node-api");
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const helpers = require("../_helpers");
const db = require("../models");
const User = db.User;


const userService = {
  // signUpPage: (req, res) => {
  //   return res.json({ user: User });
  // },

  // signUp: (req, res, callback) => {
  //   // confirm password
  //   if (req.body.passwordCheck !== req.body.password) {
  //     req.flash("error_messages", "兩次密碼輸入不同！");
  //     return res.redirect("/signup");
  //   } else {
  //     // confirm unique user
  //     return Promise.all([
  //       User.findOne({ where: { email: req.body.email } }),
  //       User.findOne({ where: { account: req.body.account } }),
  //     ]).then(([emailCheck, accountCheck]) => {
  //       if (emailCheck) {
  //         req.flash("error_messages", "信箱重複！");
  //         return res.redirect("/signup");
  //       }
  //       if (accountCheck) {
  //         req.flash("error_messages", "帳號重複！");
  //         return res.redirect("/signup");
  //       } else {
  //         User.create({
  //           name: req.body.name,
  //           email: req.body.email,
  //           account: req.body.account,
  //           password: bcrypt.hashSync(
  //             req.body.password,
  //             bcrypt.genSaltSync(10),
  //             null
  //           ),
  //         }).then((user) => {
  //           req.flash("success_messages", "成功註冊帳號！");
  //           return res.redirect("/signin");
  //         });
  //       }
  //     });
  //   }
  // },
};