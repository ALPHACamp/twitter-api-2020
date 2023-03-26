module.exports = {
  apiErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(err.status || 500).json({
        success: 'false',
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.status(500).json({
        success: 'false',
        message: `${err}`
      })
    }
    next(err)
  }
}
