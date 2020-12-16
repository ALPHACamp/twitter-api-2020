const followshipServices = require('../services/followshipServices')

const followshipController = {
  addFollowing: (req, res) => {
    followshipServices.addFollowing(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.json(data)
      }
    })
  }
}

module.exports = followshipController