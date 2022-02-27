/* User Seeder  */
//設定每位使用者的籲馬密碼(含root)
const DEFAULT_PASSWORD = '12345678'

// 設定Bcrypt 雜湊複雜度
const BCRYPT_COMPLEXITY = 10


// 設定使用者預設數量
const DEFAULT_USER_NUMBER = 20

/* Tweet Seeder  */
// 設定每位使用者會擁有的推文預設數量
const DEFAULT_TWEET_NUMBER = 10

/* Reply Seeder  */
// 設定每篇推文要有的回覆數，每一篇回覆皆代表不同的使用者
const DEFAULT_REPLIER_NUMBER = 3


/* Like Seeder  */
// 設定每篇推文要有的喜歡數，每一個喜歡皆代表不同的使用者
const DEFAULT_LIKER_NUMBER = 3

exports = module.exports = {
  DEFAULT_PASSWORD,
  BCRYPT_COMPLEXITY,
  DEFAULT_USER_NUMBER,
  DEFAULT_LIKER_NUMBER,
  DEFAULT_TWEET_NUMBER,
  DEFAULT_REPLIER_NUMBER,
}