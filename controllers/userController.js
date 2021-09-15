const db = require('../models')
const helpers = require('../_helpers')
const User = db.User
const userService = require('../services/userService')



const userController = {
  signUp: async (req, res) => {
      const { account, email, password, passwordCheck } = req.body
      if ( !account || !email || !password || !passwordCheck) {
        return res.json({ status: 'error', message: 'All fields are required'})
      }
      if (passwordCheck !== password) {
        return res.json({ status: 'error', message: 'Passwords are not the same'})
      }
    try { 
      const { status, message } = await userService.signUp( account, email, password ) 
      return res.json({status, message})
    } catch (error) {
      console.log("signUp error", error);
      res.sendStatus(500)
    }
  },
  signIn: async (req, res) => {
    try {
      const { account, password } = req.body
      // Check required data
      if (!account || !password ) {
        return res.json({
          status: 'error',
          message: 'Please enter both account and password'
        })
      }
      const { status, message, token, user } = await userService.signIn(account, password)
      return res.json({
        status,
        message,
        token,
        user
      })
    } catch (error) {
      console.log('signIn error', error)
      res.sendStatus(500)
    }
  },
  getCurrentUser: async (req, res) => {
    try {
      const currentUser = await userService.getCurrentUser(helpers.getUser(req).id)
      if (!currentUser) {
        return res.status(401).json({ status: 'error', message: 'No such user found' })
      }
      return res.status(200).json(currentUser)
    } catch (error) {
      console.log('currentUser error', error)
      res.sendStatus(500)
    }
  }
};

module.exports = userController;
