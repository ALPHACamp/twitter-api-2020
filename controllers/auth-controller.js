const authController = {
  checkUserToken: async (req, res, next) => {
    try {
      return res.status(200).json({ stauts: 'success', message: "It's a User" })
    } catch (err) {
      next(err)
    }
  },
  checkAdminToken: async (req, res, next) => {
    try {
      return res.status(200).json({ stauts: 'success', message: "It's an admin" })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = authController
