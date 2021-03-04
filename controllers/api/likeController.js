const db = require('../../models')
const Like = db.Like
const likeService = require('../../services/likeService')

const likeController = {
  addLike: (req, res) => {
    likeService.addLike(req, res, (data) => {
      return res.json(data)
    })
  },
  removeLike: (req, res) => {
    likeService.removeLike(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = likeController