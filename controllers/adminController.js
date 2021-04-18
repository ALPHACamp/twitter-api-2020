const db = require('../models')
const User = db.User

const adminController = {
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        raw: true,
        nest: true
      })
      if (users.length === 0) {
        return res.json({ message: 'db has no user!' })
      }
      console.log('users', users)
      return res.json(users)
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminController
