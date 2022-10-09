 module.exports = { 
  apiErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      res.status(401).json({
        status: 'error',
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.status(401).json({
        status: 'error',
        message: `${err}`
      })
    }
    next(err)
  },
   authErrorHandler (err, req, res, next) {
     res.status(401).json({ 
      status: 'error', 
      message: req.authError })
   }
}
