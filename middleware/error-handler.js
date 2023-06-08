module.exports = {
<<<<<<< HEAD
  apiErrorHandler(err, req, res, next) {
=======
  apiErrorHandler (err, req, res, next) {
>>>>>>> 525e157e1eb46f1a8596ba611a8cca351ffcc3d4
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
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 525e157e1eb46f1a8596ba611a8cca351ffcc3d4
