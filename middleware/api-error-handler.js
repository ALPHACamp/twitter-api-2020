
/**
 * 
 * @param {object} error 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
function apiErrorHandler (error, req, res, next) {
  if (error instanceof Error) {
    res.status(500).json({
      status: 500,
      message: `${error.name}: ${error.message}`
    })
  } else {
    res.status(500).json({
      status: 500,
      message: `${error}`
    })
  }

  next(error)
}


exports = module.exports = {
  apiErrorHandler
}