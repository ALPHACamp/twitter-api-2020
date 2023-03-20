module.exports = {
  // 應該沒用，確定沒用就殺
  // generalErrorHandler (err, req, res, next) {
  //   if (err instanceof Error) {
  //     req.flash('error_messages', `${err.message}`)
  //   } else {
  //     req.flash('error_messages', `${err}`)
  //   }
  //   res.redirect('back') // 丟回前一頁

  //   next(err)
  // },
  apiErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(err.status || 500).json({ // err.status 若有值，就是狀態碼
        status: 'error',
        message: `${err.name}: ${err.message}}`
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
