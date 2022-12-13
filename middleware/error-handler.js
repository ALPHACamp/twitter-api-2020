module.exports = {
  errorHandler(err, req, res, next) {
    if (err instanceof Error) {
      res.status(err.status || 500).json({
        status: 'error',
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: `${err}`
      })
    }
  },
  signInFail (err, req, res, next) {
    err.name = '登入失敗'
    err.message = '帳號或密碼輸入錯誤！'
    return next(err)
  }
}
