module.exports = {
  errorHandler: (error, req, res, next) => {
    if (error instanceof Error) {
      res.status(error.status || 500).json({
        status: 'error',
        message: `${error.name}: ${error.message}`
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: `${error}`
      })
    }
    next(error)
  }
}
