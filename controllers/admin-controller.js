const jwt = require('jsonwebtoken')
const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const adminController = {
  signIn: async (req, res, next) => {
    try {
      // "helpers.getUser(req).toJSON()" needs .toJSON()
      // otherwise signing in action would fail
      const theSignInuser = helpers.getUser(req).toJSON() || undefined
      if (theSignInuser.role !== 'admin') throw new Error('Only admin is allow to use backstage!')

      delete theSignInuser.password
      const token = jwt.sign(theSignInuser, process.env.JWT_SECRET, { expiresIn: '14d' })

      res.status(200).json({
        status: 'success',
        data: { token, user: theSignInuser },
      })
    } catch (error) {
      next(error)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      // for pass test, "theSignInuser = helpers.getUser(req)" can't be added .toJSON()
      const theSignInuser = helpers.getUser(req) || undefined
      if (theSignInuser.role !== 'admin') {
        throw new Error('Only admin is allowed to use backstage!')
      }

      const users = await User.findAll({
        attributes: { exclude: ['password', 'email', 'introduction', 'createdAt', 'updatedAt'] },
        include: [
          { model: Tweet, raw: true },
          { model: Like, raw: true },
          { model: User, as: 'Followers', raw: true },
          { model: User, as: 'Followings', raw: true },
        ],
        nest: true,
      })

      const usersApiData = users
        .map((user) => {
          const { Tweets, Likes, Followings, Followers, ...restProps } = {
            ...user.toJSON(),
            tweetCounts: user.Tweets.length,
            likeCounts: user.Likes.length,
            followingCounts: user.Followings.length,
            followerCounts: user.Followers.length,
          }
          return restProps
        })
        .sort((a, b) => b.tweetCounts - a.tweetCounts)

      res.status(200).json(usersApiData)
    } catch (error) {
      console.error(error)
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      // "helpers.getUser(req).toJSON()" needs .toJSON()
      // otherwise getting tweets action would fail
      const theSignInuser = helpers.getUser(req).toJSON() || undefined
      if (theSignInuser.role !== 'admin') throw new Error('Only admin is allowed to use backstage!')

      const tweets = await Tweet.findAll({
        include: {
          model: User,
          where: { role: 'user' },
          attributes: ['name', 'account', 'avatar'],
        },
        nest: true,
        raw: true,
      })

      const tweetsApiData = tweets.map((tweet) => ({
        ...tweet,
        description: tweet.description.substring(0, 50),
      }))

      res.status(200).json({
        status: 'success',
        data: { tweets: tweetsApiData },
      })
    } catch (error) {
      next(error)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      // for pass test, "theSignInuser = helpers.getUser(req)" can't be added .toJSON()
      const theSignInuser = helpers.getUser(req)
      if (theSignInuser.role !== 'admin') throw new Error('Only admin is allowed to use backstage!')

      const reqTweetId = req.params.id
      const tweet = await Tweet.findByPk(reqTweetId)
      if (!tweet) throw new Error(`This tweet doesn't exist!`)

      await tweet.destroy()
      await Reply.destroy({
        where: { tweet_id: reqTweetId },
      })
      await Like.destroy({
        where: { tweet_id: reqTweetId },
      })

      res.status(200).json({
        status: 'success',
      })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = adminController
