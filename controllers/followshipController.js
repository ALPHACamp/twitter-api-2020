const db = require('../models')
const Followship = db.Followship
const Op = db.Sequelize.Op

const followshipController = {
  follow: async (req, res) => {
    try {
      await Followship.findOrCreate({ 
        where: { followerId: req.user.id, followingId: req.body.id }
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
      const followingId = req.params.id
      const unfollow = await Followship.findOne({ where: { followingId: { [Op.eq]: followingId } } })
      if (unfollow) {
        await unfollow.destroy()
        return res.status(200).json('Accept')
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