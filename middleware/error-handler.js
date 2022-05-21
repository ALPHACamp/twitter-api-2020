module.exports = {
  apiErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(500).json({
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.status(500).json({
        message: `${err}`
      })
    }
    next(err)
  }
}
