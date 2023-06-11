const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like } = require('../../models')
const { getUser } = require('../../_helpers')

const adminController = {
  adminLogin: async (req, res, next) => {
    try {
      const reqUser = getUser(req).toJSON()
      const token = jwt.sign(reqUser, process.env.JWT_SECRET, { expiresIn: '30d' })
      const { account } = req.body
      const user = await User.findOne({
        where: { account },
        raw: true
      })
      if (!user) throw new Error('You are not admin')
      if (user.role !== 'admin') throw new Error('You are not admin')
      const userData = user
      delete userData.password
      userData.token = token
      return res.json({ status: 'success', data: userData })
    } catch (error) {
      next(error)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Tweet, as: 'UserTweets' }
        ]
      })

      const data = users.map(user => {
        const { Followers, Followings, UserTweets, ...userData } = user.toJSON()
        let likedCount = 0
        for (const i of UserTweets) {
          likedCount += i.likedCount
        }
        userData.followerCount = Followers.length
        userData.followingCount = Followings.length
        userData.userTweetCount = UserTweets.length
        userData.likedCount = likedCount
        return userData
      })
      return res.json(data)
    } catch (error) {
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll()
      return res.json({ status: 'success', data: tweets })
    } catch (error) {
      next(error)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const { id } = req.params
      const tweet = await Tweet.findByPk(id)
      if (!tweet) throw new Error('The tweet does not exist')
      await tweet.destroy()
      return res.json({ status: 'success', data: {} })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
