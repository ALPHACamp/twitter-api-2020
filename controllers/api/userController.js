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

let userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  
  signIn: (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.json({ status: 'error', message: '請填寫帳號或密碼。'})
    } 
    
    let username = req.body.email
    let password = req.body.password

    User.findOne({ where: { email: username }}).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: '此帳號不存在。' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '密碼不正確'})
      }
       var payload = { id: user.id }
       var token = jwt.sign(payload, 'JWT_SECRET')
       return res.json({ 
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id, name: user.name, email: user.email, role: user.role
        }})
    })

  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同'})
    } else {
      // confirm unique user
      return Promise.all([
        User.findOne({ where: { email: req.body.email } }),
        User.findOne({ where: { account: req.body.account } }),
      ]).then(([emailCheck, accountCheck]) => {
        if (emailCheck) {
          return res.json({ status: 'error', message: '信箱重覆'})
        }
        if (accountCheck) {
          return res.json({ status: 'error', message: '帳號重覆'})
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
            return res.json({ status: 'success', message: '成功註冊帳號'})
          });
        }
      });
    }
  },
  
  getUser: (req, res) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    console.log(currentUser, req.params);
    User.findOne({ where: { id: req.params.id } }).then((user) => {
    console.log(user);
    // User.findOne({ where: { id: currentUser.id } }).then((user) => {
    return res.render("profile", { user: user });
    });
  }
};

module.exports = userController