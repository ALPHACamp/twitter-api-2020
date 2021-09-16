// use helpers.getUser(req) to replace req.user
const apiErrorHandler = (err, req, res, next) => {
  console.error(err)
  return res.status(err.statusCode || 500).json({
    status: 'error',
    errType: err.name || 'ServerError',
    message: err.message || 'Internal Server Error'
  })
}

module.exports = apiErrorHandler
