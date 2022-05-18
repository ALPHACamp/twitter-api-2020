const { getUser } = require('../helpers/auth-helpers')
const { Followship, User } = require('../models')
const followshipController = {
  addFollowing: (req, res, next) => {
    const followerId = getUser(req).id // 使用者的 id
    const followingId = req.body.id // 要追蹤的人的 id （在form上）
    if (followerId === Number(followingId)) throw new Error('You cannot follow yourself!')
    Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })
    ])
      .then(([follower, following]) => {
        if (!follower) throw new Error("User didn't exist!")
        if (following) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: followerId,
          followingId: followingId
        })
      })
      .then(following => res.json(following))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const followerId = getUser(req).id // 使用者的 id
    const followingId = req.params.followingId // 要取消追蹤的人的 id （在form上）
    if (followerId === Number(followingId)) throw new Error('You cannot unfollow yourself!')
    Followship.findOne({
      where: {
        followerId,
        followingId
      }
    })
      .then(following => {
        if (!following) throw new Error("You haven't followed this user!")
        return following.destroy()
      })
      .then(following => res.json(following))
      .catch(err => next(err))
  }
}

module.exports = followshipController
