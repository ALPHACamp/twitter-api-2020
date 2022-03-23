module.exports = {
  generalErrorHandler: (err, req, res, next) => {
    if (err instanceof Error) {
      return res.status(500).json({
        status: 'error',
        message: `${err.message}`
      })
    }

    if (err) {
      return res.status(500).json({
        status: 'error',
        message: `${err}`
      })
    }
    next(err)
  }
}
