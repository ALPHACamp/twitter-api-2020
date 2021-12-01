const userService = require('../../services/userService')

const userController = {
  signIn: (req, res) => {
    userService.signIn(req, res, data => {
      return res.json(data)
    })
  },

  signUp: (req, res) => {
    userService.signUp(req, res, data => {
      return res.json(data)
    })
  },

  getUsers: (req, res) => {
    userService.getUsers(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = userController
