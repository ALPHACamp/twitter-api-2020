const passport = require('../config/passport')
const helpers = require('../_helpers.js')


const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if(err) return next(err)
    if(!user){
      return res.status(401).json({
        status: 'error',
        message: 'authenticated error : no user'
      })      
    }
    req.user = { ...user.dataValues }
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'user'){
    return res.status(401).json({
      status: 'error',
      message: '帳號不存在'
    })  
  }
  next()
}
const checkRoleIsUser = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'admin'){
    return res.status(401).json({
      status: 'error',
      message: '無帳戶'
    })  
  }
  next()
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  checkRoleIsUser
}
