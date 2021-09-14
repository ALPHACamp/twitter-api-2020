const bcrypt = require("bcryptjs");
const db = require('../models')
const User = db.User
const userService = require('../services/userService')

//JWT
const jwt = require("jsonwebtoken");
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signUp: async (req, res) => {
    const { account, email, password, passwordCheck } = req.body
    if ( !account || !email || !password || !passwordCheck) {
      return res.json({ status: 'error', message: 'All fields are required'})
    }
    if (req.body.passwordCheck !== req.body.password) {
      return res.json({ status: 'error', message: 'Passwords are not the same'})
    } else {
      User.findOne({where: { email  }})
        .then( user => {
          if ( !user ) {
            User.findOne({ where: { account }})
              .then(user => {
                if (!user) {
                  User.create({
                    account,
                    email,
                    password: bcrypt.hashSync(
                      password,
                      bcrypt.genSaltSync(10),
                      null
                    ),
                  }).then(() => {
                    return res.json({
                      status: "success",
                      message: "Successfully registered",
                    });
                  });
                } else {
                  return res.json({
                    status: "error",
                    message: "This account name has been registered",
                  });
                }
              })
          } else {
            return res.json({ status: 'error', message: 'This email has been registered'})
          }
      })
    }
  }
};
 
module.exports = userController;
