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
