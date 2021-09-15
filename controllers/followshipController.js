const db = require('../models')
const Followship = db.Followship

const followshipController = {
  follow: async (req, res) => {
    try {
      const data = {}
      data.followerId = req.user.id
      data.followingId = req.params.id
      const followship = await Followship.findOrCreate({ ...data })
      return res.status(200).json({ followship })
    }
    catch (error) {
      console.log(error)
      return res.status(417)
    }
  },

  unfollow: async (req, res) => {
    try {
      const followshipId = req.params.id
      const unfollow = await Followship.findByPk({
        where: { id: { [Op.eq]: followshipId } }
      })
      await unfollow.destroy()
      return res.status(200)
    }
    catch (error) {
      console.log(error)
      return res.status(417)
    }
  }
}

module.exports = followshipController