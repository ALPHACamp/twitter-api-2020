const apiError = require('../libs/apiError')

function apiErrorHandler(err, req, res, next) {
  console.error(err)

  if (err instanceof apiError) {
    return res.json({
      status: `${err.code} error`,
      message: err.message || 'Internal server error'
    })
  }
}

module.exports = apiErrorHandler

