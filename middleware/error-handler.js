module.exports = {
  apiErrorHandler (err, req, res, next) {
    if (err === '帳號或密碼輸入錯誤！') {
      res.status(200).json({
        status: 'error',
        message: err
      })
    } else if (err === '帳號不存在！') {
      res.status(200).json({
        status: 'error',
        message: err
      })
    } else if (err instanceof Error) {
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
    next(err)
  }
}
