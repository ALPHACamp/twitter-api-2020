module.exports = {
  apiErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(500).json({
        status: 'error',
        statusCode: res.statusCode,
        data: null,
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.status(500).json({
        status: 'error',
        statusCode: res.statusCode,
        data: null,
        message: `${err}`
      })
    }
    next(err)
  }
}
