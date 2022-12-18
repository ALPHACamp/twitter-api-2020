const helpers = require('../_helpers')
const { User, Followship } = require('../models')

const followshipController = {
  addFollow: (req, res, next) => {
    const followingId = req.body.id
    return Promise.all([
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId
        }
      }),
      User.findByPk(followingId)
    ])
      .then(([followship, user]) => {
        if (!user) throw new Error('User account does not exist')
        if (followship) throw new Error('You have already followed this user')
        Followship.create({
          followerId: helpers.getUser(req).id,
          followingId
        })
          .then(() => {
            const { id, account, name, avatar, introduction } = user
            res.json({
              id,
              account,
              name,
              avatar,
              introduction,
              isFollow: true,
              followerId: helpers.getUser(req).id,
              followingId
            })
          })
          .catch(err => next(err))
      })
      .catch(err => next(err))
  },
  removeFollow: (req, res, next) => {
    const followingId = req.params.followingId
    return Promise.all([
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId
        }
      }),
      User.findByPk(followingId)
    ])
      .then(([followship, user]) => {
        if (!user) throw new Error('User account does not exist')
        if (!followship) throw new Error('You have not followed this user yet!')
        followship.destroy()
          .then(() => {
            const { id, account, name, avatar, introduction } = user
            res.json({
              id,
              account,
              name,
              avatar,
              introduction,
              isFollow: false
            })
          })
          .catch(err => next(err))
      })
      .catch(err => next(err))
  }
}

module.exports = followshipController
