// 從請求中獲取用戶物件
function getUser(req) {
  return req.user
}

// 設置用戶物件到請求中
function setUser(req, user) {
  req.user = user
}

module.exports = {
  getUser,
  setUser
}
