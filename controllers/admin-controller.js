const jwt = require('jsonwebtoken')
const { User, Tweet, Like, Reply } = require('../models')

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
          { model: Like, raw: true },
          { model: User, as: 'Followers', raw: true },
          { model: User, as: 'Followings', raw: true }
        ],
        nest: true
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
  },
  getTweets: async (req, res, next) => {
    try {
      const theSignInUser = req.user.toJSON()
      if (theSignInUser.role !== 'admin') throw new Error('Only admin is allowed to use backstage!')

      const tweets = await Tweet.findAll({
        include: {
          model: User,
          where: { role: 'user' },
          attributes: ['name', 'account', 'avatar']
        },
        nest: true,
        raw: true
      })

      const tweetsApiData = tweets.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, 50)
      }))

      res.status(200).json({
        status: 'success',
        data: { tweets: tweetsApiData }
      })
    } catch(error) {
      next(error)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const theSignInUser = req.user.toJSON()
      if (theSignInUser.role !== 'admin') throw new Error('Only admin is allowed to use backstage!')

      const reqTweetId = req.params.id
      const tweet = await Tweet.findByPk(reqTweetId)
      if (!tweet) throw new Error(`This tweet doesn't exist!`)

      await tweet.destroy()
      await Reply.destroy({
        where: { tweet_id: reqTweetId }
      })
      await Like.destroy({
        where: { tweet_id: reqTweetId }
      })

      res.status(200).json({
        status: 'success'
      })
    } catch(error) {
      next(error)
    }
  }
}

module.exports = adminController
