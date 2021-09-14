const passport = require('../config/passport')


const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    // TODO 之後須補上 admin限制(admin不可進入前台 --> 顯示無帳戶)
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





module.exports = {
  authenticated
}
