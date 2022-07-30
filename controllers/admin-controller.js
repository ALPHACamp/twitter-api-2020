const jwt = require('jsonwebtoken')
const { User, Tweet, Like } = require('../models')
const user = require('../models/user')

const adminController = {
  signIn: async (req, res, next) => {
    try {
      const theSignInUser = req.user.toJSON()
      if (theSignInUser.role !== 'admin') throw new Error('Only admin is allow to use backstage!')

      delete theSignInUser.password
      const token = jwt.sign(theSignInUser, process.env.JWT_SECRET, { expiresIn: '14d' })

      res.status(200).json({
        status: 'success',
        data: { token, user: theSignInUser }
      })
    } catch(error) {
      next(error)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const theSignInUser = req.user.toJSON()
      if (theSignInUser.role !== 'admin') throw new Error('Only admin is allowed to use backstage!')

      const users = await User.findAll({
        where: { role: 'user' },
        attributes: { exclude: ['password', 'email', 'introduction', 'createdAt', 'updatedAt' ] },
        include: [
          { model: Tweet, raw: true },
          { model: Like, raw: true},
          { model: User, as: 'Followers', raw: true },
          { model: User, as: 'Followings', raw: true }
        ],
        nest: true,
      })

      const usersApiData = users.map(user => {
        const { Tweets, Likes, Followings, Followers, ...restProps } = {
          ...user.toJSON(),
          tweetCounts: user.Tweets.length,
          likeCounts: user.Likes.length,
          followingCounts: user.Followings.length,
          followerCounts: user.Followers.length
        }
        return restProps
      }).sort((a, b) => b.tweetCounts - a.tweetCounts)

    res.status(200).json({
      status: 'success',
      data: { users: usersApiData }
    })
    } catch(error){
      next(error)
    }
  }
}

module.exports = adminController
