const validator = require('validator')
const { User } = require('../models')
const authHelpers = require('../_helpers')

/**
 * 
 * @param {object} req 
 */
// 檢查註冊表單格式
async function postUsersFormDataCheck(req) {
  const errorMessage = []
  const { name, account, email, password, checkPassword } = req.body

  // 檢查所有欄位都有填寫
  if (!name || !account || !email || !password || !checkPassword) {
    errorMessage.push('所有欄位都要填寫')
  }

  // 檢查名字/暱稱是否超過50字
  if (name && !validator.isLength(name, { min: 0, max: 50 })) {
    errorMessage.push('名字上限 50 字')
  }

  // 檢查密碼和確認密碼是否一致
  if (password !== checkPassword) {
    errorMessage.push('密碼和確認密碼必須一致')
  }

  // 檢查電子郵件是否為正確格式
  if (email && !validator.isEmail(email)) {
    errorMessage.push('電子郵件不是正確格式')
  }

  // 檢查是否為已註冊的帳號或者電子郵件
  const [isExistAccount, isExistEmail] = await Promise.all([
    User.findOne({ where: { account } }),
    User.findOne({ where: { email } })
  ])

  // 帳號是否重複註冊
  if (isExistAccount) {
    errorMessage.push('account 已重複註冊！')
  }

  // 電子郵件是否重複註冊
  if (isExistEmail) {
    errorMessage.push('email 已重複註冊！')
  }

  if (errorMessage.length > 0) {
    return errorMessage
  }
}
// 檢查使用者設定表單格式
async function putUserSettingCheck(req) {
  const errorMessage = []
  const { name, account, email, password, checkPassword } = req.body

  // 檢查所有欄位都有填寫
  if (!name || !account || !email || !password || !checkPassword) {
    errorMessage.push('所有欄位都要填寫')
  }

  // 檢查名字/暱稱是否超過50字
  if (name && !validator.isLength(name, { min: 0, max: 50 })) {
    errorMessage.push('名字上限 50 字')
  }

  // 檢查密碼和確認密碼是否一致
  if (password !== checkPassword) {
    errorMessage.push('密碼和確認密碼必須一致')
  }

  // 檢查電子郵件是否為正確格式
  if (email && !validator.isEmail(email)) {
    errorMessage.push('電子郵件不是正確格式')
  }

  // 帳號是否重複註冊
  // 由於該表單是在使用者存在且登入的狀態下進行編輯，所以只需要判斷是否為不同的已存在帳號
  // 電子郵件是否重複註冊
  // 由於該表單是在使用者存在且登入的狀態下進行編輯，所以只需要判斷是否為不同的已存在電子郵件

  const [isExistAccount, isExistEmail] = await Promise.all([
    User.findOne({ attributes: ['id', 'account'], where: { account } }),
    User.findOne({ attributes: ['id', 'email'], where: { email } })
  ])

  if (isExistAccount && isExistAccount.id !== authHelpers.getUser(req).id) {
    errorMessage.push('account 已重複註冊！')
  }

  if (isExistEmail && isExistEmail.id !== authHelpers.getUser(req).id) {
    errorMessage.push('Email 已重複註冊！')
  }

  if (errorMessage.length > 0) {
    return errorMessage
  }
}
// 檢查使用者資料-profile表單格式
async function putUserCheck(req) {
  const errorMessage = []
  const { name, introduction } = req.body

  // 檢查所有欄位都有填寫
  if (!name) {
    errorMessage.push('名字要填寫')
  }

  if (name && !validator.isLength(name, { min: 0, max: 50 })) {
    errorMessage.push('名字上限 50 字')
  }

  if (introduction && !validator.isLength(introduction, { min: 0, max: 160 })) {
    errorMessage.push('自我介紹上限 160 字')
  }

  if (errorMessage.length > 0) {
    return errorMessage
  }
}


exports = module.exports = {

  postUsersFormDataCheck,
  putUserSettingCheck,
  putUserCheck

}