module.exports = {
  generalErrorHandler: (err, req, res, next) => {
    if (err instanceof Error) {
      console.log(err)
      return res.status(500).json({
        status: 'error',
        message: `${err.message}`
      })
    } else {
      console.log(err)
      return res.status(500).json({
        status: 'error',
        message: `${err}`
      })
    }
    next(err)
  }
}
