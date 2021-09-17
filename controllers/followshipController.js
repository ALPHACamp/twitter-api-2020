const db = require('../models')
const Followship = db.Followship
const Op = db.Sequelize.Op

const followshipController = {
  follow: async (req, res) => {
    try {
      const data = {}
      data.followerId = req.user.id
      data.followingId = req.dataset.id
      const followship = await Followship.findOrCreate({ ...data })
      return res.status(200).json({ followship })
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
      if (unfollow) {
        await unfollow.destroy()
        return res.status(200)
      } else {
        return res.status(404)
      }
    }
    catch (error) {
      console.log(error)
      return res.status(404)
    }
  }
}

module.exports = followshipController