const db = require('../models')
const helpers = require('../_helpers')
const User = db.User
const userService = require('../services/userService')



const userController = {
  signUp: async (req, res) => {
      const { account, name, email, password, checkPassword } = req.body
      if ( !account || !email || !password || !checkPassword) {
        return res.json({ status: 'error', message: 'All fields are required'})
      }
      if (checkPassword !== password) {
        return res.json({ status: 'error', message: 'Passwords are not the same'})
      }
    try { 
      const { status, message } = await userService.signUp( account, name, email, password ) 
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
  getUser: async (req, res) => {
    try {
      const id = Number(req.params.id)
      const currentUserId = helpers.getUser(req).id
      const user = await userService.getUser(id)
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'No such user found'})
      }
      if ( id === currentUserId ) {
        user.isCurrent = true
        return res.status(200).json(user)
      }
      user.isCurrent = false
      return res.status(200).json(user)
    } catch (error) {
      console.log('getUser error', error)
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
  },
  putUser: async (req, res) => {
    try {
      const id = Number(req.params.id)
      const { files } = req


      if (helpers.getUser(req).id !== id) {
        return res.status(403).json({
          status: 'error',
          message: 'Cannot edit others user profile'
        })
      }

      const { status, message } = await userService.putUser(id, files, req.body)
      return res.status(200).json({
        status,
        message
      })
    } catch (error) {
      console.log('editProfile error', error)
      res.sendStatus(500)
    }
  },
  getUserTweets: async (req, res) => {
    const id = Number(req.params.id);
    const currentUserId = helpers.getUser(req).id;
    try {
      const tweets = await userService.getUserTweets(id, currentUserId)
      return res.status(200).json(tweets)
    } catch (error) {
      console.log('getUserTweets error', error)
      res.sendStatus(400)
    }
  },
  getUserRepliedTweets: async (req, res) => {
    const id = Number(req.params.id);
    const currentUserId = helpers.getUser(req).id;

    try {
      const replies = await userService.getUserRepliedTweets(id, currentUserId)
      return res.status(200).json(replies)
    } catch (error) {
      console.log('getUserRepliedTweets error', error)
      res.sendStatus(400)
    }
  },
  getUserLikedTweets: async (req, res) => {
    const id = Number(req.params.id);
    const currentUserId = helpers.getUser(req).id;

    try {
      const tweets = await userService.getUserLikedTweets(id, currentUserId)
      return res.status(200).json(tweets)
    } catch (error) {
      console.log('getUserLikedTweets error', error)
      res.sendStatus(400)
    }
  }
};

module.exports = userController;
