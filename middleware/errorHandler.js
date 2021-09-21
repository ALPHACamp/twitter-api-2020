const apiError = require('../libs/apiError')

function apiErrorHandler(err, req, res, next) {
  console.error(err)

  if (err instanceof apiError) {
    return res.status(err.code || 500).json({
      status: `${err.code} error` || 'error',
      message: err.message || 'Internal server error'
    })
  }
}

module.exports = apiErrorHandler

