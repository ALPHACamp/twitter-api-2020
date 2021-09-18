const db = require('../models')
const Followship = db.Followship
const Op = db.Sequelize.Op

const followshipController = {
  follow: async (req, res) => {
    try {
      // const followerId = req.user.id
      // const followingId = req.dataset.id
      await Followship.findOrCreate({ 
        where: { followerId: req.user.id, followingId: req.params.id }
      })
      return res.status(200).json('Accept')
    }
    catch (error) {
      console.log(error)
      return res.status(404)
    }
  },

  unfollow: async (req, res) => {
    try {
      const followshipId = req.params.id
      const unfollow = await Followship.findByPk(followshipId)
      // if (unfollow) {
        await unfollow.destroy()
        return res.status(200).json('Accept')
      // } else {
      //   return res.status(404)
      // }
    }
    catch (error) {
      console.log(error)
      return res.status(404)
    }
  }
}

module.exports = followshipController