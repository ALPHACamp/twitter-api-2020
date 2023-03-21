const errorHandler = (error, req, res, next) => {
  res.status(error.status || 500).json({
    status: 'error',
    message: (error.status === 500) ? '伺服器出現問題，請稍後再使用' : error.message
  })

  next(error)
}

module.exports = errorHandler
