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


/* Followship Seeder  */
// 設定每一位使用者能跟隨的使用者，從ID為 START - END 的使用者挑選並跟隨
const FOLLOWING_CANDIDATE_RANGE = {
  START: 0,
  END: 10
}

// 設定每個人可跟隨的人數
const DEFAULT_FOLLOWING_NUMBER = 5

exports = module.exports = {
  // User
  DEFAULT_PASSWORD,
  BCRYPT_COMPLEXITY,
  DEFAULT_USER_NUMBER,
  // Tweet
  DEFAULT_TWEET_NUMBER,
  // Like
  DEFAULT_LIKER_NUMBER,
  // Reply
  DEFAULT_REPLIER_NUMBER,
  // Followship
  DEFAULT_FOLLOWING_NUMBER,
  FOLLOWING_CANDIDATE_RANGE,
}