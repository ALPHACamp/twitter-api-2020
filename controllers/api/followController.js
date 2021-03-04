const db = require('../../models')
const Followship = db.Followship
const followService = require('../../services/followService')

const followController = {
  addFollowing: (req, res) => {
    followService.addFollowing(req, res, (data) => {
      return res.json(data)
    })
  },
  removeFollowing: (req, res) => {
    followService.removeFollowing(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = followController