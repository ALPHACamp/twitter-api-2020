const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followController = {
addFollow: (req, res, next) => {
  const { id } = req.body

  Promise.all([
    User.findByPk(id),
    Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: id
      }
    })
  ])
    .then(([user, followship]) => {

      if (!user) throw new Error('使用者不存在')

      if (helpers.getUser(req).id === Number(id)) throw new Error('你無法追蹤自己')

      if (followship) throw new Error('你已經追蹤此使用者')


      return Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: id
      })

    })
    .then(data => res.status(200).json({
      status: 'success',
      message: '追蹤中',
      data
    }))
    .catch(err => next(err))
},
  removeFollow: (req, res, next) => {
    const { followingId } = req.params

    Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: followingId
        }
      })
    ])
      .then(([user, followship]) => {

        if (!user) throw new Error('使用者不存在')

        if (!followship) throw new Error('你未追蹤此使用者')

        return followship.destroy()

      })
      .then(data => res.status(200).json({
        status: 'success',
        message: '取消追蹤',
        data
      }))
      .catch(err => next(err))
  }
}

module.exports = followController