module.exports = {
  apiErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      res.json({
        status: 'error',
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.json({
        status: 'error',
        message: `${err}`
      })
    }
    next(err)
  }
}
