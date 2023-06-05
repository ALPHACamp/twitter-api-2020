module.exports = {
  newErrorGenerate: (errorMessage, statusCode) => {
    const err = new Error(errorMessage)
    err.status = statusCode
    throw err
  }
}
