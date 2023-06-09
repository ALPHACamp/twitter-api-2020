const userController = {
  logout: (req, res, next) => {
    try {
      req.logout()
      res.json({ status: 'success' })
    } catch (error) {
      next(error)
    }
  }
}
module.exports = userController
