const userServices = require('../../services/user-services')
const userController = {
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => err ? next(err) : res.json({ status: 'success', ...data }))
  },
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, data) => err ? next(err) : res.json({ status: 'success', ...data }))
  },
  getTopUsers: (req, res, next) => {
    userServices.getTopUsers(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => err ? next(err) : res.json({ ...data.user }))
  },
  putUser: (req, res, next) => {
    userServices.putUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUserTweets: (req, res, next) => {
    userServices.getUserTweets(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUserReplies: (req, res, next) => {
    userServices.getUserReplies(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUserLikes: (req, res, next) => {
    userServices.getUserLikes(req, (err, data) => err ? next(err) : res.json(data))
  },
  removeFollowing: (req, res, next) => {
    userServices.removeFollowing(req, (err, data) => err ? next(err) : res.json(data))
  },
  addFollowing: (req, res, next) => {
    userServices.addFollowing(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUserFollowings: (req, res, next) => {
    userServices.getUserFollowings(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUserFollowers: (req, res, next) => {
    userServices.getUserFollowers(req, (err, data) => err ? next(err) : res.json(data))
  },
  addLike: (req, res, next) => {
    userServices.addLike(req, (err, data) => err ? next(err) : res.json(data))
  },
  unLike: (req, res, next) => {
    userServices.unLike(req, (err, data) => err ? next(err) : res.json(data))
  },
  getCurrentUser: (req, res) => {
    delete req.user.dataValues.password
    return res.json({ ...req.user.dataValues })
  },
  addReply: (req, res, next) => {
    userServices.addReply(req, (err, data) => err ? next(err) : res.json(data))
  },
  getReplies: (req, res, next) => {
    userServices.getReplies(req, (err, data) => err ? next(err) : res.json(data))
  }
}

module.exports = userController
