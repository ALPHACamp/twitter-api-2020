module.exports = {
  // api用Error
  apiErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      res.status(err.status || 500).json({
        status: 'error',
        message: err.message
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
