const validator = require('validator')
const { User } = require('../models')
/**
 * 
 * @param {object} req 
 */

async function postUsersFormDataCheck(req) {
  const errorMessage = []
  const { name, account, email, password, passwordConfirm } = req.body

  // 檢查所有欄位都有填寫
  if (!name || !account || !email || !password || !passwordConfirm) {
    errorMessage.push('所有欄位都要填寫')
  }

  // 檢查名字/暱稱是否超過50字
  if (!validator.isLength(name, { min: 0, max: 50 })) {
    errorMessage.push('名字上限 50 字')
  }

  // 檢查密碼和確認密碼是否一致
  if (password !== passwordConfirm) {
    errorMessage.push('密碼和確認密碼必須一致')
  }

  // 檢查電子郵件是否為正確格式
  if (!validator.isEmail(email)) {
    errorMessage.push('電子郵件不是正確格式')
  }

  // 檢查是否為已註冊的帳號或者電子郵件
  const [isExistAccount, isExistEmail] = await Promise.all([
    User.findOne({ where: { account } }),
    User.findOne({ where: { email } })
  ])

  if (isExistAccount) {
    errorMessage.push('account 已重複註冊！')
  }
  if (isExistEmail) {
    errorMessage.push('email 已重複註冊！')
  }

  if (errorMessage.length > 0) {
    return errorMessage
  }
}


exports = module.exports = {

  postUsersFormDataCheck

}