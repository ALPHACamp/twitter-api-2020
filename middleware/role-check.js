const adminAccount = process.env.ADMIN_ACCOUNT

const userLogin = (req, res, next) => {
  // 帳號、密碼為登入必填項目
  if (req.body.account === undefined || req.body.account.trim() === '') return res.status(400).json({ status: 'error', message: '帳號為必填項目' })
  if (req.body.password === undefined || req.body.password.trim() === '') return res.status(400).json({ status: 'error', message: '密碼為必填項目' })
  // 在前台登入輸入管理員帳號(root)，則給錯誤：帳號不存在
  if (req.body.account === adminAccount) throw new Error('帳號不存在')

  return next()
}

const adminLogin = (req, res, next) => {
  // 帳號、密碼為登入必填項目
  if (req.body.account === undefined || req.body.account.trim() === '') return res.status(400).json({ status: 'error', message: '帳號為必填項目' })
  if (req.body.password === undefined || req.body.password.trim() === '') return res.status(400).json({ status: 'error', message: '密碼為必填項目' })
  // 在後台登入輸入非管理員帳號(root)，則給錯誤：權限不足
  if (req.body.account !== adminAccount) return res.status(403).json({ status: 'error', message: '權限不足' })

  return next()
}

module.exports = {
  userLogin,
  adminLogin
}
