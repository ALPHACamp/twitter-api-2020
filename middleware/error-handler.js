module.exports = {
  apiErrorHandler(err, req, res, next) {
    const code = err.status || 500
    res.status(code).json({
      status: 'error',
      message: `${err.message}`
    })
  }
}
