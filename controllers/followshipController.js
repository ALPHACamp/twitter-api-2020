const { User, Followship, Tweet } = require('../models')

const increaseFollowingCounts = async (userId) => {
  return new Promise((resolve, reject) => {
    User.findByPk(userId)
      .then(user => {
        user.followingCounts += 1
        return user.update({ followingCounts: user.followingCounts })
      })
      .then(() => resolve('followingCounts + 1'))
      .catch(err => reject(err))
  })
}

const decreaseFollowingCounts = async (userId) => {
  return new Promise((resolve, reject) => {
    User.findByPk(userId)
      .then(user => {
        user.followingCounts -= 1
        return user.update({ followingCounts: user.followingCounts })
      })
      .then(() => resolve('followingCounts - 1'))
      .catch(err => reject(err))
  })
}

const increaseFollowerCounts = async (userId) => {
  return new Promise((resolve, reject) => {
    User.findByPk(userId)
      .then(user => {
        user.followerCounts += 1
        return user.update({ followerCounts: user.followerCounts })
      })
      .then(() => resolve('followerCounts + 1'))
      .catch(err => reject(err))
  })
}

const decreaseFollowerCounts = async (userId) => {
  return new Promise((resolve, reject) => {
    User.findByPk(userId)
      .then(user => {
        user.followerCounts -= 1
        return user.update({ followerCounts: user.followerCounts })
      })
      .then(() => resolve('followerCounts - 1'))
      .catch(err => reject(err))
  })
}

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const followship = await Followship.create({
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