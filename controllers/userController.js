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
    if (passwordCheck !== password) {
      return res.json({ status: 'error', message: 'Passwords are not the same'})
    }
    const duplicate_email = await User.findOne({ where: { email }})
    if (duplicate_email) {
      return res.status(422).json({ status: 'error', message: 'This email has been registered'})
    }
    const duplicate_account = await User.findOne({ where: { account }})
    if (duplicate_account) {
      return res.status(422).json({ status: "error", message: "This account name has been registered" });
    }
    
    try {
      const user = await User.create({
        account,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })
      return res.status(200).json({
        status: 'success', message: 'Successfully sign up'
      })
    } catch {
      return next()
    }
  },
  signIn: async (req, res) => {
    const { account, password } = req.body
    // Check required data
    if (!account || !password ) {
      return res.json({
        status: 'error',
        message: 'Please enter both account and password'
      })
    }
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) {
          return res.status(401).json({ status: "error", message: "no such user found" });
        }
        if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
        }
        // Give token
        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        return res.status(200).
        json({
          status: "success",
          message: "Successfully login",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      })
  }
};
 
module.exports = userController;
