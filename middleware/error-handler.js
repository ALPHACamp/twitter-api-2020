module.exports = {
  errorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(err.status || 500).json({
        status: 'error',
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: `${err}`
      })
    }
  },
  signInFail (err, req, res, next) {
    if (err.status === 401 & err.name === 'AuthenticationError') {
      res.status(err.status).json({
        status: 'fail',
        message: `${err.name}: ${err.message}`
      })
    } else {
      next(err)
    }
  }
}
