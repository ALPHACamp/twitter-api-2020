const validator = require('validator')
function sanitizedInput (input) {
  const param = input
  // Remove semicolons and HTML tag from the parameter
  const sanitizedXss = param.replace(/<[^>]*>/g, '')
  const sanitizedSQLInjection = sanitizedXss.replace(/;/g, '')

  return sanitizedSQLInjection
}

function checkUriParam (param) {
  if (!validator.isInt(param)) {
    const err = new Error('Invalid URI param!')
    err.status = 400
    throw err
  }
  return param
}
module.exports = { sanitizedInput, checkUriParam }
