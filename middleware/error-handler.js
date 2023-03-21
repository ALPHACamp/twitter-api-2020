module.exports = {
  errorHandler (err, req, res, next) {
    if (err instanceof Error) {
      // - 若有定義 err 的 status code 則使用定義的
      // - 否則一律回應 500
      res.status(err.status || 500).json({
        status: 'error',
        message: `${err.message}`
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
      })
    }
    next(err)
  }
}
