function validate(ajvValidate) {
  return (req, res, next) => {
    const valid = ajvValidate(req.body)
    if (!valid) {
      const errors = ajvValidate.errors
      return res.status(400).json(errors)
    }
    next()
  }
}

module.exports = validate