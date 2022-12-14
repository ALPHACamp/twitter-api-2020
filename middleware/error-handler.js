module.exports = {
  generalErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      // res.status(err.code).json({ status: err.code, message: err.message })
      console.log('err is here', err)
      return next(err)
    } else {
      req.status(400).json({ message: err })
    }
    next(err)
  }
}
