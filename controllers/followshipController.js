const { User, Followship, Tweet } = require('../models')

const increaseFollowingCounts = async (userId) => {
  return new Promise((resolve, reject) => {
    User.findByPk(userId)
      .then(user => {
        return user.increment('followingCounts')
      })
      .then(() => resolve('followingCounts + 1'))
      .catch(err => reject(err))
  })
}

const decreaseFollowingCounts = async (userId) => {
  return new Promise((resolve, reject) => {
    User.findByPk(userId)
      .then(user => {
        return user.decrement('followingCounts')
      })
      .then(() => resolve('followingCounts - 1'))
      .catch(err => reject(err))
  })
}

const increaseFollowerCounts = async (userId) => {
  return new Promise((resolve, reject) => {
    User.findByPk(userId)
      .then(user => {
        return user.increment('followerCounts')
      })
      .then(() => resolve('followerCounts + 1'))
      .catch(err => reject(err))
  })
}

const decreaseFollowerCounts = async (userId) => {
  return new Promise((resolve, reject) => {
    User.findByPk(userId)
      .then(user => {
        return user.decrement('followerCounts')
      })
      .then(() => resolve('followerCounts - 1'))
      .catch(err => reject(err))
  })
}

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const followship = await Followship.findOne({
        where: { followerId: req.user.id, followingId: req.body.id }
      })
      if (followship) {
        return res.json({ status: 'error', message: '已追隨這個使用者！' })
      }
      // 未追隨使用者，create 並將使用者/被追隨者 FollowingCounts/FollowerCounts + 1
      await Followship.create({
        followerId: req.user.id,
        followingId: req.body.id,
      })
      await increaseFollowingCounts(req.user.id)
      await increaseFollowerCounts(req.body.id)
      return res.json({ status: 'success', message: '新增追隨成功！' })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  removeFollowing: async (req, res, next) => {
    try {
      const followship = await Followship.findOne({
        where: {
          followingId: req.params.followingId,
          followerId: req.user.id
        }
      })
      if (!followship) {
        return res.json({ status: 'error', message: '未追隨此使用者！' })
      }
      // Followship 存在，destroy 並將使用者/被追隨者 FollowingCounts/FollowerCounts - 1
      await followship.destroy()
      await decreaseFollowingCounts(req.user.id)
      await decreaseFollowerCounts(req.params.followingId)
      return res.json({ status: 'success', message: '已取消追隨' })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = followshipController