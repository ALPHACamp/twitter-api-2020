const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const helpers = require('../_helpers')
const { Op } = require('sequelize')
const fs = require('fs')
const db = require('../models')
const User = db.User
const Like = db.Like
const Tweet = db.Tweet
const Reply = db.Reply
const Followship = db.Followship


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
    userService.getUser(req, res, (data) => {
      return res.render("profile", data);
    });
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
  putUser2: (req, res) => {
    userService.putUser(req, res, (data) => {
      if (data["status"] === "error") {
        req.flash("error_messages", data["message"]);
        return res.redirect("back");
      }
      req.flash("success_messages", data["message"]);
      return res.redirect(`/users/${req.params.id}`);
    });
  },
  settingUser: (req, res) => {
    userService.settingUser(req, res, (data) => {
      return res.render("putUser", data);
    });
  },
  reviseUser: (req, res) => {
    userService.reviseUser(req, res, (data) => {
      if (data["status"] === "error") {
        req.flash("error_messages", data["message"]);
        return res.redirect("back");
      }
      req.flash("success_messages", data["message"]);
      return res.redirect("back");
    });
  },

  getUserTweets: (req, res) => {
    userService.getUserTweets(req, res, (data) => {
      return res.render("userTweets", data);
    });
  },
  getUserReplies: (req, res) => {
    userService.getUserReplies(req, res, (data) => {
      return res.render("userReplies", data);
    });
  },
  getUserLikes: (req, res) => {
    userService.getUserLikes(req, res, (data) => {
      return res.render("userLikeTweets", data);
    });
  },
  addLike: (req, res) => {
    userService.addLike(req, res, (data) => {
      return res.redirect("back");
    });
  },
  removeLike: (req, res) => {
    userService.removeLike(req, res, (data) => {
      return res.redirect("back");
    });
  },
  addFollowing: (req, res) => {
    userService.addFollowing(req, res, (data) => {
      return res.redirect("back");
    });
  },
  removeFollowing: (req, res) => {
    userService.removeFollowing(req, res, (data) => {
      return res.redirect("back");
    });
  },
  // 測試
  getUserLikesTweet: (req, res) => {
    userService.getUserLikesTweet(req, res, (data) => {
      return res.render("userLikeTweets", data);
    });
  },
};

module.exports = userController