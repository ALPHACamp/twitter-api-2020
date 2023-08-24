
function apiErrorHandler (err, req, res, next) {
  if (err instanceof Error) {
    res.status(err.status || 500).json({ // 若無特別指定狀態碼，則設為500(伺服器錯誤)
      success: false,
      message: `${err.name}: ${err.message}`,
      cause: err.cause
    })
  } else {
    res.status(500).json({ success: false, message: `${err}` })
  }
  next(err)
}

module.exports = apiErrorHandler
