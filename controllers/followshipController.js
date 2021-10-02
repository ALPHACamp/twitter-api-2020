const db = require('../models')
const Followship = db.Followship
const Unread = db.Unread
const Op = db.Sequelize.Op

const followshipController = {
  follow: async (req, res) => {
    try {
      await Followship.findOrCreate({ 
        where: { followerId: req.user.id, followingId: req.body.id }
      })

      // 針對即時訊息做處理
      const unread = {}
      unread.type = 'twitter-follow'
      unread.user = req.user
      const unreadContent = JSON.stringify(unread)
      await Unread.create({
        sendId: req.user.id,
        receiveId: req.body.id,
        unread: unreadContent
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
      console.log("🚀 ~ file: followshipController.js ~ line 35 ~ unfollow: ~ followingId", followingId)
      const unfollow = await Followship.findOne({ where: { followingId: { [Op.eq]: followingId } } })
      console.log("🚀 ~ file: followshipController.js ~ line 37 ~ unfollow: ~  unfollow",  unfollow)
      if (unfollow) {
        await unfollow.destroy()
        console.log("🚀 ~ file: followshipController.js ~ line 40 ~ unfollow: ~ unfollow", unfollow)
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