const jwt = require('jsonwebtoken')

const userController = {

    try {
      // if (req.user.role.include('admin')) throw new Error("This account didn't exist！")

      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error ("passport didn't ")
  }
}

module.exports = userController
