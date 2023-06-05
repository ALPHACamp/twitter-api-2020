module.exports = {
  apiErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      console.log(err.status)
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
    next(err)
  }
}
