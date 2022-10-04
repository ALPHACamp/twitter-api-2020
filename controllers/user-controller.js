const jwt = require('jsonwebtoken')

const userController = {
  signIn: (req, res, next) => {
    try {
      const token = jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: '30d' }) 
      res.json({
        status: 'success',
        data: {
          token,
          user: req.user
        }
      })
    } catch (err) {
      next(err)
    }

  }
}
module.exports = userController