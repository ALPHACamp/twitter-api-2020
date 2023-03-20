module.exports = {
  errorHandler (err, req, res, next) {
    console.table({ err: JSON.stringify(err) })
    if (err instanceof Error) {
      res.status(err.status || 500).json({
        status: 'error',
        message: err.message
      })
    } else {
      res.status(500).json({
        status: 'error',
        messages: `${err}`
      })
    }
    next(err)
  }
}
