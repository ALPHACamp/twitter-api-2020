const { User } = require('../models')
const adminController = {
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        where: {
          role: 'user'
        }
      })
      res.status(200).json(users)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = adminController
