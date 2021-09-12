const adminService = require('../services/adminService')

const adminController = {
  getUsers: async (req, res) => {
    const users = await adminService.getUsers()

    // Check whether users exists
    if (!users) {
      return res
        .status(401)
        .json({ status: 'error', message: 'No users found' })
    }

    return res
      .status(200)
      .json(users)
  }
}

module.exports = adminController
