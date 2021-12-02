const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const helpers = require('../_helpers')
const { Op } = require('sequelize')
const fs = require('fs')



const userController = {
  signUpPage: (req, res) => {
    return res.render("signup");
  },
  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash("error_messages", "兩次密碼輸入不同！");
      return res.redirect("/signup");
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then((user) => {
        if (user) {
          req.flash("error_messages", "信箱重複！");
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
    console.log(
      "~~~~~~~~~~~~~~",
      req.user,
      req.body,
      "111111",
      helpers.getUser(req)
    );
    const currentUser = req.user ? req.user : helpers.getUser(req);
    User.findOne({ where: { id: currentUser.id } }).then((user) => {
      console.log(user);
      return res.render("profile", { user: user });
    });
  },

  editUser: (req, res) => {
    // console.log(
    //   "~~~~~~~~~~~~~~",
    //   req.user,
    //   req.body,
    //   "111111",
    //   helpers.getUser(req)
    // );
    const currentUser = req.user ? req.user : helpers.getUser(req);
    User.findOne({ where: { id: currentUser.id } }).then((user) => {
      console.log(user);
      return res.render("edit", { user: user });
    });
  },

   putUser: (req, res) => {
    console.log(
      "~~~~~~~~~~~~~~",
      // req.user,
      req.body,
      "111111",
      // helpers.getUser(req),
      "params",
      req.params
      ,req.file
    );
    const { file } = req
    const currentUser = req.user ? req.user : helpers.getUser(req);
    return Promise.all([
       User.findAll({ where: { 
      email: { [Op.not]: currentUser.email }
    }}),
      User.findAll({ where: {
        account: { [Op.not]: currentUser.account }
      }})
    ]).then(([usersEmail, usersAccount]) => {
      let emailCheck = usersEmail.map(d => d.email).includes(req.body.email)
      let accountCheck = usersAccount.map(d => d.account).includes(req.body.account)
      console.log('emailCheck', emailCheck,'accountCheck', accountCheck)
        if (!req.body.name || !req.body.email || !req.body.account || !req.body.password || !req.body.passwordCheck) {
        req.flash('error_messages', '名字，信箱，帳號，密碼，確認密碼不能為空!')
        return res.redirect('back')
        } 
        if (req.body.password !== req.body.passwordCheck) {
          req.flash('error_messages', '密碼與確認密碼不一致!')
          return res.redirect('back')
        } 
        if (emailCheck) {
          req.flash('error_messages', '此信箱己被註冊，請更改!')
          return res.redirect('back')
        } 
        if (accountCheck) {
          req.flash("error_messages", "帳戶名稱已被其他使用者使用，請更改!");
          return res.redirect("back");
        }
        if (file) {
          fs.readFile(file.path, (err, data) => {
            if (err) console.log('Error: ', err)
            fs.writeFile(`upload/${file.originalname}`, data, () => {
              return User.findByPk(req.params.id)
                .then(user => {
                  console.log('!!!!!!!!!!!!!!!!!!!',user)
                  user.update({
                    ...req.body,
                    cover: file ? `/upload/${file.originalname}` : req.body.cover,
                    // avatar: file ? `/upload/${file.originalname}` : req.body.avatar,
                    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
                  }).then(user => {
                    req.flash('success_messages', '使用者資料編輯成功')
                    res.redirect(`/users/${req.params.id}`);
                  })
                })
            })
          })
        } else {
          return User.findByPk(req.params.id).then(user => {
            user
              .update({
                ...req.body,
                cover: req.body.cover,
                // avatar: req.body.avatar,
                password: bcrypt.hashSync(
                  req.body.password,
                  bcrypt.genSaltSync(10),
                  null
                ),
              })
              .then(() => {
                req.flash("success_messages", "使用者編輯成功");
                return res.redirect(`/users/${req.params.id}`);
              });
          })
        }
    })
  },
  // putUser: (req, res) => {
  //   console.log(
  //     "~~~~~~~~~~~~~~",
  //     req.user,
  //     req.body,
  //     "111111",
  //     helpers.getUser(req),
  //     "params",
  //     req.params
  //   );
  //   const currentUser = req.user ? req.user : helpers.getUser(req);
  //   return Promise.all([
  //      User.findAll({ where: { 
  //     email: { [Op.not]: currentUser.email }
  //   }}),
  //     User.findAll({ where: {
  //       account: { [Op.not]: currentUser.account }
  //     }})
  //   ]).then(([usersEmail, usersAccount]) => {
  //     let emailCheck = usersEmail.map(d => d.email).includes(req.body.email)
  //     let accountCheck = usersAccount.map(d => d.account).includes(req.body.account)
  //     console.log('emailCheck', emailCheck,'accountCheck', accountCheck)
  //       if (!req.body.name || !req.body.email || !req.body.account || !req.body.password || !req.body.passwordCheck) {
  //       req.flash('error_messages', '名字，信箱，帳號，密碼，確認密碼不能為空!')
  //       return res.redirect('back')
  //       } else if (req.body.password !== req.body.passwordCheck) {
  //         req.flash('error_messages', '密碼與確認密碼不一致!')
  //         return res.redirect('back')
  //       } else if (emailCheck) {
  //         req.flash('error_messages', '此信箱己被註冊，請更改!')
  //         return res.redirect('back')
  //       } else if (accountCheck) {
  //         req.flash("error_messages", "帳戶名稱已被其他使用者使用，請更改!");
  //         return res.redirect("back");
  //       }
  //       return User.findByPk(req.params.id).then(user => {
  //         user
  //           .update({
  //             ...req.body,
  //             password: bcrypt.hashSync(
  //               req.body.password,
  //               bcrypt.genSaltSync(10),
  //               null)
  //           })
  //           .then(() => {
  //             req.flash("success_messages", "使用者編輯成功");
  //             return res.redirect(`/users/${req.params.id}`);
  //           });
  //       })
  //   })
  // },
};

module.exports = userController