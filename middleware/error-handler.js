module.exports = {
  errorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(404).json({
        status: 'error',
        message: `${err.name}:${err.message}`
      })
    } else {
      res.status(404).json({
        status: 'error',
        message: `${err}`
      })
    }
  }
}
