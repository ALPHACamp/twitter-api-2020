// const db = require('../models')

const adminController = {
  // for testing: test if authenticated & authenticatedAdmin works
  getUsers: (req, res) => {
    return res.json({ status: 'success', message: 'getUsers' })
  }
}

module.exports = adminController
