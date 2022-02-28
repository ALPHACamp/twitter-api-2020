const userLogin = (req, res, next) => {
  // 帳號、密碼為登入必填項目
  if (req.body.account === undefined || req.body.account.trim() === '') throw new Error('帳號為必填項目')
  if (req.body.password === undefined || req.body.password.trim() === '') throw new Error('密碼為必填項目')
  // 在前台登入輸入管理員帳號(root)，則給錯誤：帳號不存在
  if (req.body.account === process.env.ADMIN_ACCOUNT) throw new Error('帳號不存在')

  return next()
}

const adminLogin = (req, res, next) => {
  // 帳號、密碼為登入必填項目
  if (req.body.account === undefined || req.body.account.trim() === '') throw new Error('帳號為必填項目')
  if (req.body.password === undefined || req.body.password.trim() === '') throw new Error('密碼為必填項目')
  // 在後台登入輸入非管理員帳號(root)，則給錯誤：帳號不存在
  if (req.body.account !== process.env.ADMIN_ACCOUNT) throw new Error('帳號不存在')

  return next()
}

module.exports = {
  userLogin,
  adminLogin
}
