const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const helpers = require('../_helpers')
const { Op } = require('sequelize')
const fs = require('fs')
const db = require('../models')
const User = db.User
const Like = db.Like


const userService = require("../services/userService");

const userController = {
  signUpPage: (req, res) => {
    return res.render("signup");
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.checkPassword !== req.body.password) {
      req.flash("error_messages", "兩次密碼輸入不同！");
      return res.redirect("/signup");
    } else {
      // confirm unique user
      return Promise.all([
        User.findOne({ where: { email: req.body.email } }),
        User.findOne({ where: { account: req.body.account } }),
      ]).then(([emailCheck, accountCheck]) => {
        if (emailCheck) {
          req.flash("error_messages", "信箱重複！");
          return res.redirect("/signup");
        }
        if (accountCheck) {
          req.flash("error_messages", "帳號重複！");
          return res.redirect("/signup");
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            account: req.body.account,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10),
              null
            ),
          }).then((user) => {
            req.flash("success_messages", "成功註冊帳號！");
            return res.redirect("/signin");
          });
        }
      });
    }
  },

  signInPage: (req, res) => {
    return res.render("signin");
  },
  signIn: (req, res) => {
    req.flash("success_messages", "成功登入！");
    res.redirect("/tweets");
  },
  logout: (req, res) => {
    req.flash("success_messages", "登出成功！");
    req.logout();
    res.redirect("/signin");
  },

  getUser: (req, res) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    userService.getUser(req, res, (data) => {
      return res.render("profile", data);
    });
    // const currentUser = req.user ? req.user : helpers.getUser(req);
    // User.findOne({ where: { id: req.params.id } }).then((user) => {
    //   // User.findOne({ where: { id: currentUser.id } }).then((user) => {
    //   return res.render("profile", { user: user });
    // });
  },

  editUser: (req, res) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    if (currentUser.id !== Number(req.params.id)) {
      req.flash("error_messages", "只能編輯自己的資訊");
      return res.redirect(`/users/${currentUser.id}`);
    }
    User.findOne({ where: { id: currentUser.id } }).then((user) => {
      return res.render("edit", { user: user });
    });
  },

  putUser: (req, res) => {
    userService.putUser(req, res, (data) => {
      if (data["status"] === "error") {
        req.flash("error_messages", data["message"]);
        return res.redirect("back");
      }
      req.flash("success_messages", data["message"]);
      return res.redirect(`/users/${req.params.id}`);
    });
  },

  //   putUser: (req, res) => {
  //     const { file } = req;
  //     const currentUser = req.user ? req.user : helpers.getUser(req);
  //     return Promise.all([
  //       User.findAll({
  //         where: {
  //           email: { [Op.not]: currentUser.email },
  //         },
  //       }),
  //       User.findAll({
  //         where: {
  //           account: { [Op.not]: currentUser.account },
  //         },
  //       }),
  //     ]).then(([usersEmail, usersAccount]) => {
  //       let emailCheck = usersEmail.map((d) => d.email).includes(req.body.email);
  //       let accountCheck = usersAccount
  //         .map((d) => d.account)
  //         .includes(req.body.account);
  //       console.log("emailCheck", emailCheck, "accountCheck", accountCheck);
  //       if (
  //         !req.body.name ||
  //         !req.body.email ||
  //         !req.body.account ||
  //         !req.body.password ||
  //         !req.body.passwordCheck
  //       ) {
  //         req.flash(
  //           "error_messages",
  //           "名字，信箱，帳號，密碼，確認密碼不能為空!"
  //         );
  //         return res.redirect("back");
  //       }
  //       if (req.body.password !== req.body.passwordCheck) {
  //         req.flash("error_messages", "密碼與確認密碼不一致!");
  //         return res.redirect("back");
  //       }
  //       if (emailCheck) {
  //         req.flash("error_messages", "此信箱己被註冊，請更改!");
  //         return res.redirect("back");
  //       }
  //       if (accountCheck) {
  //         req.flash("error_messages", "帳戶名稱已被其他使用者使用，請更改!");
  //         return res.redirect("back");
  //       }
  //       if (file) {
  //         // fs.readFile(file.path, (err, data) => {
  //           imgur.setClientID(IMGUR_CLIENT_ID)
  //           imgur.upload(file.path, (err, img) => {
  //           // if (err) console.log("Error: ", err);
  //           // fs.writeFile(`upload/${file.originalname}`, data, () => {
  //             return User.findByPk(req.params.id).then((user) => {
  //               user
  //                 .update({
  //                   ...req.body,
  //                   cover: file ? img.data.link : user.cover,
  //                   avatar: file ? img.data.link : user.avatar,
  //                   // cover: file ? `/upload/${file.originalname}` : req.body.cover,
  //                   // avatar: file ? `/upload/${file.originalname}` : req.body.avatar,
  //                   password: bcrypt.hashSync(
  //                     req.body.password,
  //                     bcrypt.genSaltSync(10),
  //                     null
  //                   ),
  //                 })
  //                 .then((user) => {
  //                   req.flash("success_messages", "使用者資料編輯成功");
  //                   res.redirect(`/users/${req.params.id}`);
  //                 });
  //             });
  //           });
  //         // });
  //       } else {
  //         return User.findByPk(req.params.id).then((user) => {
  //           user
  //             .update({
  //               ...req.body,
  //               cover: user.cover,
  //               avatar: user.avatar,
  //               password: bcrypt.hashSync(
  //                 req.body.password,
  //                 bcrypt.genSaltSync(10),
  //                 null
  //               ),
  //             })
  //             .then(() => {
  //               req.flash("success_messages", "使用者編輯成功");
  //               return res.redirect(`/users/${req.params.id}`);
  //             });
  //         });
  //       }
  //     });
  //   },
  addLike: (req, res) => {
    userService.addLike(req, res, (data) => {
      return res.redirect("back")
    })
  },
  removeLike: (req, res) => {
    userService.removeLike(req, res, (data) => {
      return res.redirect("back")
    })
  },
  // addLike: (req, res) => {
  //   const currentUser = req.user ? req.user : helpers.getUser(req)
  //   Like.findOne({
  //     where: {
  //       UserId: currentUser.id,
  //       TweetId: req.params.id,
  //     }
  //   }).then(like => {
  //     if (!like) {
  //       return Like.create({
  //       UserId: currentUser.id,
  //       TweetId: req.params.id,
  //       isLike: true
  //     }).then(like => {
  //       return res.redirect("back")
  //     })
  //     } else {
  //       if (like.isLike === false) {
  //         return like.update({ ...like, isLike: !like.isLike }).then((like) => {
  //           return res.redirect("back")
  //         });
  //       } return res.redirect("back")
  //     }
  //   })
  // },
  // removeLike: (req, res) => {
  //   const currentUser = req.user ? req.user : helpers.getUser(req);
  //   Like.findOne({
  //     where: {
  //       UserId: currentUser.id,
  //       TweetId: req.params.id,
  //     },
  //   }).then((like) => {
  //     if (!like) {
  //       return res.redirect("back");
  //     } else {
  //       return like.update({ ...like, isLike: false }).then((like) => {
  //         return res.redirect("back");
  //       });
  //     }
  //   });
  // },
};

module.exports = userController