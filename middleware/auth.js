const passport = require('../config/passport')


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





module.exports = {
  authenticated
}
