const db = require('../../models')
const { Followship, User } = db
const helpers = require('../../_helpers')

const followshipController = {
  follow: async (req, res) => {
    try {
      const followingId = Number(req.body.id)
      const followerId = helpers.getUser(req).id
      if (followingId === followerId) {
        return res.json({
          status: 'error',
          message: 'Can NOT follow yourself!'
        })
      }
      const user = await User.findByPk(followingId)
      if (!user) {
        return res.json({
          status: 'error',
          message: 'This user did NOT exist!'
        })
      }
      const followStatusCheck = await Followship.findOne({
        where: {
          followingId,
          followerId
        }
      })
      if (followStatusCheck) {
        return res.json({
          status: 'error',
          message: "You've already followed this user!"
        })
      }
      await Followship.create({
        followerId,
        followingId
      })
      return res.status(200).json({
        status: 'success',
        message: 'Successfully follow this user!'
      })
    } catch (err) {
      console.log(err)
    }
  },
  unFollow: async (req, res) => {
    const followingId = req.params.id
    const followerId = helpers.getUser(req).id
    if (Number(followingId) === followerId) {
      return res.json({
        status: 'error',
        message: 'Can NOT unfollow yourself!'
      })
    }
    const user = await User.findByPk(followingId)
    if (!user) {
      return res.json({
        status: 'error',
        message: 'This user did NOT exist!'
      })
    }
    const followStatusCheck = await Followship.findOne({
      where: {
        followingId,
        followerId
      }
    })
    if (!followStatusCheck) {
      return res.json({
        status: 'error',
        message: 'You have NOT followed this user!'
      })
    }
    await followStatusCheck.destroy()

    return res.json({
      status: 'success',
      message: 'Successfully unfollow this user!'
    })
  }
}

module.exports = followshipController
