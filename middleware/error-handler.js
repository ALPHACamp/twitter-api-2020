module.exports = {
  apiErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(400).json({
        status: 'error',
        message: `${err.name}: ${err.message}`
      })
    } else if (err instanceof RangeError) {
      res.status(400).json({
        status: 'error',
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.status(400).json({
        status: 'error',
        message: `${err}`
      })
    }
    next(err)
  }
}
