module.exports = {

  apiErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      if (err.status === 401) {
        res.status(401).json({ status: 'error', message: '尚未登入' })
      } else if (err.status === 403) {
        res.status(403).json({ status: 'error', message: '權限不足' })
      } else if (err.status === 404) {
        console.log(err)
        res.status(404).json({ status: 'error', message: `${err.message}` })
      } else {
        res.status(500).json({ status: 'error', message: `${err.message}` })
      }
    } else {
      res.status(500).json({ status: 'error', message: `${err}` })
    }
  }
}
