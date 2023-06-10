function getUser (req) {
  return req.user
}

module.exports = {
  getUser
}

// 單項測試
// npx mocha test/requests/user.spec.js --exit

// 切換環境
// $env:NODE_ENV = "test"
// $env:NODE_ENV = "development"

// 察看環境
// echo $env:NODE_ENV

// [1 ~ 50]  //  tweet全部
// [1, 2 ,3 ,4 ,5] // 留言人

// tweet全部.map( 等下要被reply的tweet_id) {
//   留言群 3  = [1, 2 , 3 , 4 , 5]
//   留言群.map( 人 =>  {
//     Reply.create
//     tweetId = 等下要被reply的tweet_id,
//     userId = 人
//   }
// }
