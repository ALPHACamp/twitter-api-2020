const paramsChecker = (req, res, next) => {
  if (!req.params.id.trim()) throw new ReferenceError('請輸入數字 id 當 parameters')
  if (isNaN(Number(req.params.id))) throw new ReferenceError('請輸入數字 id 當 parameters')
  return next()
}
module.exports = {
  paramsChecker
}
