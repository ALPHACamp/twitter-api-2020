const userService = require('../services/userService')

const userController = {
  signUp: (req, res) => {
    userService.signUp(req, res, (data) => res.status(data.status).json(data))
  },
  login: (req, res) => {
    userService.login(req, res, (data) => res.status(data.status).json(data))
  }
}

module.exports = userController