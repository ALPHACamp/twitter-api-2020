module.exports = {
  apiErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(err.status || 500).json({ // err.status 若有值，就是狀態碼
        status: 'error',
        // message: `${err.name}: ${err.message}}`
        // 為只顯示訊息，先改成下1，等全部完成後看起來沒問題，再殺掉吧...
        message: `${err.message}`
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: `${err}`
      })
    }
    // next(err) // 目前加這個沒用 (已拋 .json，但未來要加 log 就可能能用到)
  }
}
