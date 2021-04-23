module.exports = {
  catchError: (res, error) => {
    const data = { status: 'error', message: error.toString() }
    console.log(error)
    return res.status(500).json(data)
  }
}
