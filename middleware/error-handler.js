module.exports = {
  apiErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(err.status || 200).json({ status: 'error', message: `${err.message}` })
    } else {
      res.status(200).json({ status: 'error', message: `${err}` })
    }
    next(err)
  }
}
