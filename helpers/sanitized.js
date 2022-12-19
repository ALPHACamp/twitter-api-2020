function sanitizedInput (input) {
  const param = input
  // Remove semicolons and HTML tag from the parameter
  const sanitizedXss = param.replace(/<[^>]*>/g, '')
  const sanitizedSQLInjection = sanitizedXss.replace(/;/g, '')

  return sanitizedSQLInjection
}

module.exports = { sanitizedInput }
