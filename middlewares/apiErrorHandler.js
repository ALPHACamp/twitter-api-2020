const apiErrorHandler = (err, req, res, next) => {
  console.error(err)
  return res.status(err.statusCode || 500).json({
    status: 'error',
    errType: err.errType || 'ServerError',
    message: err.message || 'Internal Server Error'
  })
}

module.exports = apiErrorHandler
