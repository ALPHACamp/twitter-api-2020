const { User, Tweet, Reply, Like, sequelize, Followship } = require('../models')
const helpers = require('../_helpers')


const followshipController = {

  postFollowship: (req, res) => {
    return Followship.create({
      followerId: helpers.getUser(req).id,
      //正在追蹤誰
      followingId: req.body.id,
    })
      .then((tweet) => {
        return res.json({ status: 'success', message: 'Followship was successfully create' })
      })
      .catch(error => console.error(error))
  },

  deleteFollowship: (req, res) => {
    return Followship.findOne({
      where: {

        followerId: helpers.getUser(req).id,
        //正在追蹤誰
        followingId: req.params.followingId,
      }
    })
      .then(async (followship) => {
        await followship.destroy()
        return res.json({ status: 'success', message: 'Followship was successfully delete' })
      })

  },

}
module.exports = followshipController
