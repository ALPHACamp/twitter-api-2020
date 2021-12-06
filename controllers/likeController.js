// 載入所需套件
const likeService = require('../services/likeService')

const likeController = {
  postLike: async (req, res) => {
    try {
      await likeService.postLike(req, res, data => {
        return res.json(data)
      })
    } catch (err) {
      return res.status(400).json({ status: err.name, message: err.message })
    }
  },

  postUnlike: (req, res) => {
    likeService.postUnlike(req, res, data => {
      return res.json(data)
    })
  },
}

// likeService exports
module.exports = likeController