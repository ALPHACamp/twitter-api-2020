module.exports = {
  apiErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(err.status || 500).json({
        status: 'error',
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: `${err}`
      })
    }
    next(err)
  },
  contentTypeHandlerFromData (req, res, next) {
    if (!req.is('multipart/form-data')) {
      res.status(400).json({
        status: 'error',
        message: 'ContextTypeError:Please use multipart/form-data.'
      })
    } else {
      next()
    }
  },
  contentTypeHandlerJson (req, res, next) {
    if (!req.is('application/json')) {
      res.status(400).json({
        status: 'error',
        message: 'ContextTypeError:Please use application/json.'
      })
    } else {
      next()
    }
  }
}
