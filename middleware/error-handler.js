module.exports = {
  generalErrorHandler: (err, req, res, next) => {
    if (err instanceof Error) {
      const { name, message } = err
      res.status(500).json({
        status: 'error',
        message: `${name}: ${message}`
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: err
      })
    }

    next(err)
  }
}