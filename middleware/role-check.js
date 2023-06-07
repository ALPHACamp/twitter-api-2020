const roleCheck = (role, errorMessage) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const error = new Error(errorMessage)
      return res.status(401).json({
        status: 'error',
        message: error.message
      })
    }
    next()
  }
}

module.exports = {
  isUser: roleCheck('user', '使用者不存在!'),
  isAdmin: roleCheck('admin', '使用者不存在!'),
  isAuthUser: roleCheck('user', 'Unauthorized'),
  isAuthAdmin: roleCheck('admin', 'Unauthorized')
}
