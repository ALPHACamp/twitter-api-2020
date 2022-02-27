// 設定每位使用者的籲馬密碼(含root)
const DEFAULT_PASSWORD = '12345678'

// 設定Bcrypt 雜湊複雜度
const BCRYPT_COMPLEXITY = 10

// 設定使用者預設數量
const DEFAULT_USER_NUMBER = 20

// 設定每位使用者會擁有的推文預設數量
const DEFAULT_TWEET_NUMBER = 10

exports = module.exports = {
  DEFAULT_PASSWORD,
  BCRYPT_COMPLEXITY,
  DEFAULT_USER_NUMBER,
  DEFAULT_TWEET_NUMBER
}