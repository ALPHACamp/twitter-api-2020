const { Followship, User } = require('../models')
const helpers = require('../_helpers')
const followshipController = {
  addFollowing: async (req, res, next) => {
  try {
    const { id } = req.body
    const user = await User.findByPk(id)
    const followship = await Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: id
      }
    })
    if (!user) {
      throw new Error("使用者不存在!")
    }
    if (followship) {
      throw new Error("你已追蹤此人！")
    }
    const result = await Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: id
    })
    const newData = result.dataValues
    res.json(newData)
  } catch (err) {
    return next(err)
  }
},
  removeFollowing: (req, res, next) => {
    const {id} = req.params
    Followship.findOne({
        where: {
            followerId: helpers.getUser(req).id,
            followingId: id
        }
    })
        .then(followship => {
        if (!followship) throw new Error("你已追蹤過此人！")
        followship.destroy()
        return res.json({ status: 'success', message: '取消追蹤！' });
    })
        .then(() => res.redirect('back'))
        .catch (err => next(err))
    }
}
module.exports = followshipController
