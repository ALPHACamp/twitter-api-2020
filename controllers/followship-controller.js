const { User, Followship } = require('../models')
const helpers = require('../_helpers')
const sequelize = require('sequelize')
const { Op, literal } = sequelize

const followshipController = {
  getTop10Followers: (req, res, next) => {
    const topCount = parseInt(req.query.top) // 獲得查詢參數並轉換為整數
    // 驗證 topCount 是否為有效數字
    if (isNaN(topCount) || topCount <= 0) {
      return res.status(400).json({ status: 'error', message: '請提供有效的 top 參數' })
    }

    const userId = helpers.getUser(req).id

    return Promise.all([
      User.findAll({
        where: {
          role: {
            [Op.not]: 'admin', // 排除 'admin' 角色
          },
        },
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          'introduction',
          [literal('(SELECT COUNT(DISTINCT id) FROM Followships WHERE following_id = User.id)'), 'totalFollowers'],
        ],
        include: { model: User, as: 'Followers', attributes: [] },
        order: [[sequelize.literal('totalFollowers'), 'DESC']], // 根據追蹤者進行降序
        limit: topCount, // 限制前十位
      }),
      Followship.findAll({
        where: { followerId: userId },
      }),
    ])
      .then(([users, following]) => {
        users = users.map((user) => ({
          ...user.dataValues,
          isFollowed: following.some((f) => f.followingId === user.id),
        }))
        res.status(200).json({ users: users.filter((user) => user.id !== userId) })
      })
      .catch((err) => next(err))
  },
  addFollowship: (req, res, next) => {
    const followingId = req.body.id
    const followerId = helpers.getUser(req).id
    if (followerId == followingId) throw new Error('不可追蹤自己')
    User.findByPk(followingId)
      .then((user) => {
        if (!user) throw new Error('該使用者不存在')
        if (user.dataValues.role === 'admin') throw new Error('不可追蹤管理者')
        Followship.findOrCreate({
          where: {
            followerId,
            followingId,
          },
        })
          .then((followship) => {
            // followship[1]為boolean，建立成功回傳true
            if (!followship[1]) throw new Error('已經追蹤過該使用者了')
            return res.status(200).json({ message: '成功建立追蹤關係' })
          })
          .catch((err) => next(err))
      })
      .catch((err) => next(err))
  },
  removeFollowship: (req, res, next) => {
    const followingId = req.params.followingId
    const followerId = helpers.getUser(req).id
    if (!followingId) throw new Error('請輸入有效的 id')
    Followship.findOne({
      where: {
        followerId,
        followingId,
      },
    })
      .then((followship) => {
        if (!followship) throw new Error('並未追蹤該使用者')
        followship.destroy().then(() => {
          return res.status(200).json({ message: '成功移除追蹤' })
        })
      })
      .catch((err) => next(err))
  },
}

module.exports = followshipController
