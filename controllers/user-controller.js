const { use } = require('chai')
const jwt = require('jsonwebtoken')
const userServices = require('../services/user-services')

const userController = {
  signUp: async (req, res, next) => {
    await userServices.signUp(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  signIn: async (req, res, next) => {
    const userData = req.user.toJSON()
    delete userData.password
    try {
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      await res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
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
  addFollowing: async (req, res, next) => {
    await userServices.addFollowing(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  removeFollowing: async (req, res, next) => {
   await userServices.removeFollowing(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}
module.exports = userController
