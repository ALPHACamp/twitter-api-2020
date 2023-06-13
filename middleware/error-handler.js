module.exports = {
  apiErrorHandler(err, req, res, next) {
    const isStatusCodeValid = Number.isInteger(err.status) && err.status >= 100 && err.status < 600
    const statusCode = isStatusCodeValid ? err.status : 500
    return new Promise((resolve, reject) => {
      if (err instanceof Error) {
        resolve(
          res.status(statusCode).json({
            status: 'error',
            message: `${err.name}: ${err.message}`
          })
        )
      } else {
        resolve(
          res.status(500).json({
            status: 'error',
            message: `${err}`
          })
        )
      }
    })
      .catch(err => next(err))
  }
}
