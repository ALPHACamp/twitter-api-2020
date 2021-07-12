function returnError (err, req, res, next) {
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err
  })
}

module.exports = {
  returnError
}
