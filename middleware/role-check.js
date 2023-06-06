
module.exports = {
  isUser: (req, res, next) => {
    if (req.user.role !== '') {
      const error = new Error('帳號不存在！')
      return res.status(401).json({
        status: 'error',
        message: `${error.message}`
      })
    }
    next()
  },

  isAdmin: (req, res, next) => {
    if (req.user.role !== 'admin') {
      const error = new Error('帳號不存在！')
      return res.status(401).json({
        status: 'error',
        message: `${error.message}`
      })
    }
    next()
  },

  isAuthUser: (req, res, next) => {
    if (req.user.role !== '') {
      const error = new Error('unauthorized')
      return res.status(401).json({
        status: 'error',
        message: `${error.message}`
      })
    }
    next()
  },

  isAuthAdmin: (req, res, next) => {
    if (req.user.role !== 'admin') {
      const error = new Error('unauthorized')
      return res.status(401).json({
        status: 'error',
        message: `${error.message}`
      })
    }
    next()
  }
}
