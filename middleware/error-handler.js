const errorHandler = (error, req, res, next) => {
  res.status(error.status || 500).json({
    status: 'error',
    message: error.message
  })

  next(error)
}

module.exports = errorHandler
