const likeService = require('../../services/likeService.js')

const likeController = {
  getLikes: (req, res) => {
    likeService.getLikes(req, res, (data) => {
      return res.json(data)
    })
  },

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