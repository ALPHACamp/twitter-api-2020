module.exports = {
  errorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(err.status || 500).json({
        status: 'error',
        type: `${err.name}: ${err.message}`,
        message: err.message
      })
    } else {
      res.status(500).json({
        status: 'error',
        type: `error500, ${err.name}: ${err.message}`,
        message: err.message
      })
    }
  },
  signInFail (err, req, res, next) {
    if (err.status === 401 & err.name === 'AuthenticationError') {
      res.status(err.status).json({
        status: 'fail',
        type: `${err.name}: ${err.message}`,
        message: '帳號或密碼錯誤，請重新輸入'
      })
    } else {
      next(err)
    }
  }
}
