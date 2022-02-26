const { User } = require('../models')
const paramsChecker = (req, res, next) => {
  if (!req.params.id.trim()) throw new ReferenceError('請輸入數字 id 當 parameters')
  if (isNaN(Number(req.params.id))) throw new ReferenceError('請輸入數字 id 當 parameters')
  return next()
}
const adminChecker = (req, res, next) => {
  return User.findByPk(req.params.id, {
    raw: true,
    nest: true
  })
    .then(user => {
      if (!user || user.role === 'admin') throw new Error('資料庫內找不到使用者資料')
      return next()
    })
    .catch(err => next(err))
}

module.exports = {
  paramsChecker,
  adminChecker
}
