const db = require('../models')
const User = db.User
const Followship = db.Followship
const helpers = require('../_helpers.js')

const followshipController = {
  postFollowship: async (req, res) => {
    const followerId = helpers.getUser(req).id
    const followingId = (req.body.id) ? +req.body.id.trim() : +req.body.id

    if (!followingId) return res.json({ status: 'error', message: '欲追蹤的使用者請勿空白' })
    if (followerId === followingId) return res.json({ status: 'error', message: '無法追蹤自己' })

    // 檢查使用者是否存在
    const checkUser = (id) => {
      return User.findByPk(id)
    }

    // 檢查追蹤關係是否存在
    const checkFollowship = (followerId, followingId) => {
      return Followship.findOne({
        where: { followerId, followingId }
      })
    }

    try {
      await Promise.all([checkUser(followingId), checkFollowship(followerId, followingId)])
        .then(results => {
          if (!results[0]) return res.json({ status: 'error', message: '找不到欲追蹤的使用者資料' })
          if (results[1]) return res.json({ status: 'error', message: '已有此追蹤資料，無法重複新增' })

          const followingUser = results[0]

          // 建立追蹤關係
          return Followship.create({
            followerId,
            followingId
          })
            .then(followship => {
              if (!followship) return res.json({ status: 'error', message: '建立追蹤資料失敗' })

              // 更新 follower user 資料: 追蹤別人數量、following user 資料: 被別人追蹤數量
              return User.findByPk(followerId)
                .then(async (followerUser) => {
                  await followerUser.increment('followingCount', { by: 1 })
                  await followingUser.increment('followerCount', { by: 1 })
                  return res.json({ status: 'success', message: '成功建立一組追蹤關係' })
                })
            })
        })
    } catch (err) {
      console.warn(err)
      return res.json({ status: 'error', message: `${err}` })
    }
  }
}

module.exports = followshipController
