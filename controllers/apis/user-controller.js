const userServices = require('../../services/user-services')
const { Tweet, User, Reply, Like } = require('../../models')
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
  getTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          { model: User, attributes: ['account', 'name', 'avatar'] },
          { model: Reply },
          { model: Like }
        ],
        order: [['createdAt', 'DESC']],
        nest: true
        // raw: true
      })
      console.log('getTweets', tweets)
      return res.json(tweets)
    } catch (err) {
      console.log('error=', err)
    }
  },
  getCurrentUser: (req, res) => {
    return res.json({
      id: req.user.id,
      account: req.user.account,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      cover: req.user.cover,
      role: req.user.role
    })
  }
}

module.exports = userController
