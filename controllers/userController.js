// 載入所需套件
const userService = require('../services/userService')

const userController = {
  signUp: (req, res) => {
    userService.signUp(req, res, data => {
      return res.json(data)
    })
  },

  signIn: (req, res) => {
    userService.signIn(req, res, data => {
      if (data.status === 'error') {
        return res.status(401).json(data)
      }
      return res.json(data)
    })
  },

  getUser: (req, res) => {
    userService.getUser(req, res, data => {
      return res.json(data)
    })
  },
}

// userService exports
module.exports = userController