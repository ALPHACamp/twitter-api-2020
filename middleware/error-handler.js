
const generalErrorHandler = (err, req, res, next) => {
    if (err instanceof Error) {
      res.status(err.code).json({ status: err.code, message: err.message })
    } else {
      res.locals.error = err
      const status = err.status || 500
      res.status(status)
      res.json({ status, message: err })
    }
    next(err)
  }

module.exports = {
    generalErrorHandler
}
