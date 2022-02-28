
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
  const DEFAULT_ERROR_CODE = 200
  const errorCode = error.code

  switch (error.code) {
    case 400:
    case 401:
    case 403:
    case 404:
    case 500:
      res.status(DEFAULT_ERROR_CODE).json({
        code: errorCode,
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