module.exports = {
  apiErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(500).json({
        status: 'error',
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: `${err.name}: ${err.message}`
      })
    }
  },

  catchAsync (func) {
    return (req, res, next) => {
      func(req, res, next).catch(next)
    }
  }
}
