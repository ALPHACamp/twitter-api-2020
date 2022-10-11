const uniqueConstraintErrorHandler = (err, req, res, next) => {
  console.log(err)
  if (err.errors && err.errors[0]?.message === 'email must be unique') {
    return res.status(422).json({
      status: 'error',
      message: 'Email already exists.'
    })
  }
  if (err.errors && err.errors[0]?.message === 'account must be unique') {
    return res.status(422).json({
      status: 'error',
      message: 'Account already exists.'
    })
  }
  next(err)
}

const generalErrorHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    return res.status(err.status || 400).json({
      status: 'error',
      message: `${err.message}`
    })
  } else {
    res.status(500).json({
      status: 'error',
      message: `${err}`
    })
  }
  next(err)
}

module.exports = {
  uniqueConstraintErrorHandler,
  generalErrorHandler
}
