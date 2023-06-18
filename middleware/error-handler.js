module.exports = {
  apiErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      if (err.message === '帳號不存在!') {
        return res.status(403).json({
          status: 'error',
          message: [
            {
              path: 'account',
              msg: err.message
            }
          ]
        })
      }

      if (err.message === '密碼輸入錯誤') {
        return res.status(403).json({
          status: 'error',
          message: [
            {
              path: 'password',
              msg: err.message
            }
          ]
        })
      }
      res.status(err.status || 500).json({
        status: 'error',
        message: `${err.message}`
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
