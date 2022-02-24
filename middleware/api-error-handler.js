
/**
 * 
 * @param {object} error 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
function apiErrorHandler(error, req, res, next) {
  // 這裡系統會統一將error視為物件

  const DEFAULT_STATUS = 'error'
  const errorCode = error.code
  console.log('inside error')
  switch (error.code) {
    case 400:
    case 401:
    case 403:
    case 404:
    case 500:
      res.status(errorCode).json({
        status: DEFAULT_STATUS,
        message: error.message
      })
      break
  }

  next(error)
}


exports = module.exports = {
  apiErrorHandler
}