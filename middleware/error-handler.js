module.exports = {
  generalErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(err.status || 500).json({
        stauts: 'error',
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.status(500).json({
        stauts: 'error',
        message: `${err}`
      })
    }
    next()
  }
}
