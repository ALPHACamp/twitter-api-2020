const { use } = require('chai')
const userServices = require('../services/user-services')
const { User, Followship } = require('../models')

const userController = {
  signUp: async (req, res, next) => {
    await userServices.signUp(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  signIn: async (req, res, next) => {
    await userServices.signIn(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUser: async (req, res, next) => {
    await userServices.getUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUserTweets: async (req, res, next) => {
    await userServices.getUserTweets(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUserRepliedTweets: async (req, res, next) => {
    await userServices.getUserRepliedTweets(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUserLikes: async (req, res, next) => {
    await userServices.getUserLikes(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUserFollowings: async (req, res, next) => {
    await userServices.getUserFollowings(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUserFollowers: async (req, res, next) => {
    await userServices.getUserFollowers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  editUser: async (req, res, next) => {
    await userServices.editUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  putUser: async (req, res, next) => {
    await userServices.putUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getTopUsers: async (req, res, next) => {
    await userServices.getTopUsers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  addFollowing: (req, res, next) => {
    const followingId = req.body.id
    const followerId = req.user.id
    if (followerId === followingId) throw new Error('不可追蹤自己')
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
    removeFollowing: (req, res, next) => {
    const followingId = req.params.followingId
    const followerId = req.user.id
    Followship.findOne({
      where: {
        followerId,
        followingId
      },
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        followship.destroy().then(()=>{
          return res.status(200).json({ message: '成功移除追蹤' })
        })
      })
      .catch((err) => next(err))
  },
  addLike: async (req, res, next) => {
    await userServices.addLike(req, (err, data) => err ? next(err) : res.json(data))
  },
  removeLike: async (req, res, next) => {
    await userServices.removeLike(req, (err, data) => err ? next(err) : res.json(data))
  }
}
module.exports = userController
