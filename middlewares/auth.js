module.exports = {
  getReqUserFromToken: (req, res, next) => {
    if (!req.header('Authorization')) {
      return next()
    }

    const token = req.header('Authorization').replace('Bearer ', '')
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(400).json({
          status: 'error',
          message: 'invalid token'
        })
      } else {
        req.user = decoded
        return next()
      }
    })
  }
}