const { User, Followship, sequelize } = require('../models')
const helpers = require('../_helpers')
const { Op } = require('sequelize')

const followshipController = {
  addFollowing: (req, res, next) => {
    const followingId = Number(req.body.id) // 當下按鈕所按的使用者
    const UserId = helpers.getUser(req).id // 登入使用者的 ID
    
    // 確認被追蹤使用者是否存在
    if (!followingId) {
        return res.status(404).json({
          status: 'error',
          message: '查無此使用者'
        })
      }

    // 不能按自己讚
    if (followingId === UserId) {
        return res.status(422).json({
          status: 'error',
          message: '使用者不可以追蹤自己'
        })
      }

      return Promise.all([
        User.findByPk(followingId),
        Followship.findOne({
          where: {
            followerId: UserId,
            followingId
          }
        })
      ])
      .then(([user, followship]) => {
      
        // 確認使用者是否存在
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在'
        })
      }

      // 確認是否已經按過追蹤
      if (followship) {
        return res.status(422).json({
          status: 'error',
          message: '你已經追蹤過了'
        })
      }

      return Followship.create({
        followerId: UserId,
        followingId
        })
      })
      .then((followship) => res.status(200).json({
        ...followship.toJSON()
      }))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const followingId = Numeber(req.params.id) // 當下按的使用者
    const UserId = helpers.getUser(req).id // 登入使用者 ID

    // 不能追蹤自己
    if (followingId === UserId) {
        return res.status(422).json({
          status: 'error',
          message: '使用者不可以取消追蹤自己'
        })
      }

    return Promise.all([
        User.findByPk(followingId),
        Followship.findOne({
          where: {
            followerId: UserId,
            followingId
          }
        })
      ])
    .then(([user, followship]) => {
    
      // 確認使用者是否存在
    if (!user || user.role === 'admin') {
      return res.status(404).json({
        status: 'error',
        message: '使用者不存在'
      })
    }
    
    // 確認是否尚未按過追蹤
    if (!followship) {
        return res.status(422).json({
          status: 'error',
          message: '你還沒追蹤喔'
        })
      }
    return followship.destroy()
    })
    
    .then(() => res.status(200).json({
      status: 'success'
    }))
    .catch(err => next(err))
  },
  getTopFollow: (req, res, next) => {
    const DEFAULT_LIMIT = 10
    const UserId = helpers.getUser(req).id // 登入使用者 ID

    return User.findAll({
      limit: DEFAULT_LIMIT,
      attributes: [
        'id', 'name', 'account', 'avatar',
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE followingId = User.id)'), 'followerCount'],
        [sequelize.literal(`EXISTS(SELECT true FROM Followships WHERE Followships.followingId = ${UserId} AND Followships.followingId = User.id)`), 'isFollowed']
      ],
      where: {
        id: {
          [Op.not]: req.user.toJSON().id
        },
        role: {
          [Op.not]: 'admin'
        }
      },
      exclude: [
            'introduction',
            'password',
            'updatedAt',
            'createdAt'
      ],
      // order: [[sequelize.literal('followerCount'), 'DESC'], ['id', 'ASC']],
      raw: true,
      nest: true
    })
    .then(users => res.status(200).json(
      users
    ))
    .catch(err => next(err))
  }
}

module.exports = followshipController