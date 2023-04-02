module.exports = {
  errorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(404).json({
        status: 'error',
        message: `${err.message}`
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
