// 載入所需套件
const userService = require('../services/userService')

const userController = {
  signUp: (req, res) => {
    userService.signUp(req, res, data => {
      return res.json(data)
    })
  }
}

// userService exports
module.exports = userController