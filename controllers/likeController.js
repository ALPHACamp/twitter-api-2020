const likeServices = require('../services/like-services')

const likeController = {
  addLike: (req, res, next) => {
    likeServices.addLike(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  unLike: (req, res, next) => {
    likeServices.unLike(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = likeController
