const userController = {
  logout: (req, res, next) => {
    try {
      req.logout()
      res.json({ status: 'success' })
    } catch (error) {
      next(error)
    }
  },
  enter: (req, res, next) => {
    try {
      res.status(200).json({ status: 'success' })
    } catch (error) {
      next(error)
    }
  }
}
module.exports = userController
