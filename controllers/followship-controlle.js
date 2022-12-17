const { User, Followship } = require('../models')
const { getUser } = require('../_helpers')

const followshipController = {
  postFollow: async (req, res, next) => {
    const followerId = getUser(req).dataValues.id
    const followingId = Number(req.body.id)

    const following = await User.findByPk(followingId)
    if (!following) return res.status(404).json({ status: 'error', message: '找不到使用者！' })
    if (followerId === followingId) return res.status(400).json({ status: 'error', message: '使用者不可以追蹤自己！' })

    const followed = await Followship.findOne({ where: { followerId, followingId } })
    if (followed) return res.status(400).json({ status: 'error', message: '使用者已追蹤此用戶！' })

    let createdFollow = await Followship.create({
      followerId,
      followingId
    })
    createdFollow = createdFollow.toJSON()
    return res.status(200).json({ status: 'success', data: createdFollow })
  }
}

module.exports = followshipController
