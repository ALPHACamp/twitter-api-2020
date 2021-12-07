const bcrypt = require('bcryptjs')

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../../_helpers')
const db = require('../../models')
const User = db.User


const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userService = require('../../services/userService')

let userController = {
  signUpPage: (req, res) => {
    return res.render("signup");
  },

  signIn: (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.json({ status: "error", message: "請填寫帳號或密碼。" });
    }

    let username = req.body.email;
    let password = req.body.password;

    User.findOne({ where: { email: username } }).then((user) => {
      if (!user)
        return res
          .status(401)
          .json({ status: "error", message: "此帳號不存在。" });
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: "error", message: "密碼不正確" });
      }
      var payload = { id: user.id };
      var token = jwt.sign(payload, process.env.JWT_SECRET);
      return res.json({
        status: "success",
        message: "ok",
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.checkPassword !== req.body.password) {
      return res.json({ status: "error", message: "兩次密碼輸入不同" });
    } else {
      // confirm unique user
      return Promise.all([
        User.findOne({ where: { email: req.body.email } }),
        User.findOne({ where: { account: req.body.account } }),
      ]).then(([emailCheck, accountCheck]) => {
        if (emailCheck) {
          return res.json({ status: "error", message: "信箱重覆" });
        }
        if (accountCheck) {
          return res.json({ status: "error", message: "帳號重覆" });
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
            return res.json({ status: "success", message: "成功註冊帳號" });
          });
        }
      });
    }
  },
  getUser: (req, res) => {
    // const currentUser = req.user ? req.user : helpers.getUser(req);
    userService.getUser(req, res, (data) => {
      return res.json(data);
    });
    // User.findOne({ where: { id: req.params.id } }).then((user) => {
    //   // User.findOne({ where: { id: currentUser.id } }).then((user) => {
    //   // return res.render("profile", { user: user });
    //   return res.json({ user: user });
    // });
  },
  putUser: (req, res) => {
    userService.putUser(req, res, (data) => {
      return res.json(data);
    });
  },
  addLike: (req, res) => {
    userService.addLike(req, res, (data) => {
      return res.json(data);
    });
  },
  removeLike: (req, res) => {
    userService.removeLike(req, res, (data) => {
      return res.json(data);
    });
  },
  addFollowing: (req, res) => {
    userService.addFollowing(req, res, (data) => {
      return res.json(data);
    });
  },
  removeFollowing: (req, res) => {
    userService.removeFollowing(req, res, (data) => {
      return res.json(data);
    });
  },
  getUserTweets: (req, res) => {
    userService.getUserTweets(req, res, (data) => {
      return res.json(data);
    });
  },
  getUserReplies: (req, res) => {
    userService.getUserReplies(req, res, (data) => {
      return res.json(data);
    });
  },
  getUserLikes: (req, res) => {
    userService.getUserReplies(req, res, (data) => {
      return res.json(data);
    });
  },
  getCurrentUser: (req, res) => {
    console.log(req.user);
    return res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      account: req.user.account,
      avatar: req.user.avatar,
      cover: req.user.cover,
      introduction: req.user.introduction,
      role: req.user.role,
    });
  },
  getFollowers: (req, res) => {
    userService.getFollowers(req, res, (data) => {
      return res.json(data)
    })
  },
  getFollowings: (req, res) => {
    userService.getFollowings(req, res, (data) => {
      return res.json(data)
    })
  }
};

module.exports = userController


  // putUser: (req, res) => {
  //   const { file } = req;
  //   const currentUser = req.user ? req.user : helpers.getUser(req);
  //   return Promise.all([
  //     User.findAll({
  //       where: {
  //         email: { [Op.not]: currentUser.email },
  //       },
  //     }),
  //     User.findAll({
  //       where: {
  //         account: { [Op.not]: currentUser.account },
  //       },
  //     }),
  //   ]).then(([usersEmail, usersAccount]) => {
  //     let emailCheck = usersEmail.map((d) => d.email).includes(req.body.email);
  //     let accountCheck = usersAccount
  //       .map((d) => d.account)
  //       .includes(req.body.account);
  //     if (
  //       !req.body.name ||
  //       !req.body.email ||
  //       !req.body.account ||
  //       !req.body.password ||
  //       !req.body.passwordCheck
  //     ) {
  //       req.flash(
  //         "error_messages",
  //         "名字，信箱，帳號，密碼，確認密碼不能為空!"
  //       );
  //       return res.redirect("back");
  //     }
  //     if (req.body.password !== req.body.passwordCheck) {
  //       req.flash("error_messages", "密碼與確認密碼不一致!");
  //       return res.redirect("back");
  //     }
  //     if (emailCheck) {
  //       req.flash("error_messages", "此信箱己被註冊，請更改!");
  //       return res.redirect("back");
  //     }
  //     if (accountCheck) {
  //       req.flash("error_messages", "帳戶名稱已被其他使用者使用，請更改!");
  //       return res.redirect("back");
  //     }
  //     if (file) {
  //       // fs.readFile(file.path, (err, data) => {
  //       imgur.setClientID(IMGUR_CLIENT_ID);
  //       imgur.upload(file.path, (err, img) => {
  //         // if (err) console.log("Error: ", err);
  //         // fs.writeFile(`upload/${file.originalname}`, data, () => {
  //         return User.findByPk(req.params.id).then((user) => {
  //           user
  //             .update({
  //               ...req.body,
  //               cover: file ? img.data.link : user.cover,
  //               avatar: file ? img.data.link : user.avatar,
  //               // cover: file ? `/upload/${file.originalname}` : req.body.cover,
  //               // avatar: file ? `/upload/${file.originalname}` : req.body.avatar,
  //               password: bcrypt.hashSync(
  //                 req.body.password,
  //                 bcrypt.genSaltSync(10),
  //                 null
  //               ),
  //             })
  //             .then((user) => {
  //               req.flash("success_messages", "使用者資料編輯成功");
  //               res.redirect(`/users/${req.params.id}`);
  //             });
  //         });
  //       });
  //       // });
  //     } else {
  //       return User.findByPk(req.params.id).then((user) => {
  //         user
  //           .update({
  //             ...req.body,
  //             cover: user.cover,
  //             avatar: user.avatar,
  //             password: bcrypt.hashSync(
  //               req.body.password,
  //               bcrypt.genSaltSync(10),
  //               null
  //             ),
  //           })
  //           .then(() => {
  //             req.flash("success_messages", "使用者編輯成功");
  //             return res.redirect(`/users/${req.params.id}`);
  //           });
  //       });
  //     }
  //   });
  // },
