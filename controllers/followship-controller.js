const { User, Followship } = require('../models')
const { getUser } = require('../_helpers')
const { relativeTime } = require('../helpers/date-helper')

const followshipController = {
  addFollowing: (req, res, next) => {
    // 測試檔未通過
    const followingId = Number(req.body.id) // 被追蹤的人
    const followerId = getUser(req).id // 追隨者
    return Promise.all([
      User.findOne({ where: { id: followingId } }),
      Followship.findOne({ where: { followingId, followerId } })
    ]).then(([following, followships]) => {
      if (!following) return res.status(500).json({ status: 'error', message: '查無使用者資料' })
      if (followerId === followingId) res.status(500).json({ status: 'error', message: '不能追蹤自己' })
      if (followships) return res.status(500).json({ status: 'error', message: '已追蹤這個使用者' })
      return Followship.create({
        followingId,
        followerId
      })
    })
      .then(followship => {
        const data = followship.toJSON()
        data.createdAt = relativeTime(data.createdAt)
        return res.status(200).json(data)
      }).catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    return Followship.destroy({
      where: {
        followerId: getUser(req).id,
        followingId: Number(req.params.followingId)
      }
    }).then(deletedFollowship => {
      if (!deletedFollowship) res.status(500).json({ status: 'error', message: '你沒有追蹤這個使用者!' })
      res.status(200).json({ status: 'success', message: '取消追蹤成功!' })
    })
      .catch(err => next(err))
  }
}
module.exports = followshipController
