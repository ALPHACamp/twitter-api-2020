const tweetService = require('../services/tweetService')
const adminService = require('../services/adminService')

const adminController = {
  adminSignIn : async (req, res) => {
    try {
      const { account, password } = req.body
      // Check required data
      if (!account || !password) {
        return res.json({
          status: 'error',
          message: 'Please enter both account and password',
        })
      }
      const { status, message, token, user } = await adminService.adminSignIn(account, password)
      return res.json({
        status,
        message,
        token,
        user,
      })
    } catch (error) {
      console.log('signIn error', error)
      res.sendStatus(500)
    }    
  }
};

module.exports = adminController;
