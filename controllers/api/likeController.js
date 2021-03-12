const db = require('../../models')
const Like = db.Like
const likeService = require('../../services/likeService')

const likeController = {
  addLike: (req, res) => {
    likeService.addLike(req, res, (data) => {
      if (data.status === 'error') return res.status(data.statusCode).json(data)
      return res.json(data)
    })
  },
  removeLike: (req, res) => {
    likeService.removeLike(req, res, (data) => {
      if (data.status === 'error') return res.status(data.statusCode).json(data)
      return res.json(data)
    })
  }
}

module.exports = likeController