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

const fkConstraintErrorHandler = (err, req, res, next) => {
  if (err.fields && err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(404).json({
      status: 'error',
      message: `${err.fields[0]} dose not exist.`
    })
  }
  next(err)
}

const generalErrorHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    return res.status(err.status || 500).json({
      status: 'error',
      message: `${err.message}`
    })
  } else {
    return res.status(500).json({
      status: 'error',
      message: `${err}`
    })
  }
}

module.exports = {
  uniqueConstraintErrorHandler,
  fkConstraintErrorHandler,
  generalErrorHandler
}
