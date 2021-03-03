const adminService = require('../../services/adminService.js')

const adminController = {
  signIn: (req, res) => {
    adminService.signIn(req, res, (data) => {
      if (data['message'] === 'no such user found') {
        return res.status(401).json(data)
      }
      return res.json(data)
    })
  },


}

module.exports = adminController
