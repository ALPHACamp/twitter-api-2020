const likeService = require('../services/likeService')

const likeController = {
  likeTweet: (req, res) => {
    likeService.likeTweet(req, res, data => res.status(data.status).json(data))
  }
}

module.exports = likeController