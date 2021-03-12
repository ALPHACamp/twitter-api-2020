const db = require('../../models')
const Followship = db.Followship
const followService = require('../../services/followService')

const followController = {
  addFollowing: (req, res) => {
    followService.addFollowing(req, res, (data) => {
      if (data.status === 'error') return res.status(data.statusCode).json(data)
      return res.json(data)
    })
  },
  removeFollowing: (req, res) => {
    followService.removeFollowing(req, res, (data) => {
      if (data.status === 'error') return res.status(data.statusCode).json(data)
      return res.json(data)
    })
  }
}

module.exports = followController