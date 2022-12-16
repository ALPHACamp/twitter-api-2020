module.exports = {
<<<<<<< HEAD
  generalErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      // res.status(err.code).json({ status: err.code, message: err.message })
      return next(err)
    } else {
      req.status(400).json({ message: err })
    }
    next(err)
  }
}
=======
	generalErrorHandler (err, req, res, next) {
		if (err instanceof Error) {
			res.status(err.code).json({'status':err.code,'message':err.message})
		} else {
			res.locals.error = err
			const status = err.status || 500
			res.status(status)
			res.json({ status,message: err })
		} 
		next(err)
	}
}
>>>>>>> master
