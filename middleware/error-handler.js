const { StatusCodes } = require('http-status-codes')

module.exports = {
  errorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: `${err.name}: ${err.message}` })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: `${err}` })
    }
    next(err)
  }
}
