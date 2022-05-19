module.exports = {
  errorHandler (err, req, res, next) {
    if (err instanceof Error) {
      console.log(1)
      res.status(500).json({
        status: 'error',
        message: `${err.name}:${err.message}`
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: `${err}`
      })
    }
  }
}
