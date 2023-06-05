const { getUser } = require('../../_helpers')

const userController = {
  login: async (req, res, next) => {
    try {
      const userData = getUser(req)
      console.log(userData)
      // if(!user) return res.json({status: 'failed'})
      res.json({ status: 'success', data: 123 })
    } catch (error) {
      next(error)
    }
  },
  signUp: (req, res, next) => { }
}

module.exports = userController
