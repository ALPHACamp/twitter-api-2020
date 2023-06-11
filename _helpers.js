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

// mysql:
// bc5c2f008640ed : ea186cd0 @ us-cdbr-east-06.cleardb.net / heroku_b017a6c5ca6ac62 ? reconnect=true
