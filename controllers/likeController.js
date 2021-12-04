// 載入所需套件
const likeService = require('../services/likeService')

const likeController = {
  postLike: (req, res) => {
    likeService.postLike(req, res, data => {
      return res.json(data)
    })
  }
}

// likeService exports
module.exports = likeController