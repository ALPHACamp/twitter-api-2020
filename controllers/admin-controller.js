const jwt = require('jsonwebtoken')
const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const adminController = {
  // feature: admin sign in to backage
  // route: POST /api/admin/signin
  signIn: async (req, res, next) => {
    try {
      const admin = helpers.getUser(req)
      const token = jwt.sign(admin, process.env.JWT_SECRET, { expiresIn: '14d' })

      res.json({
        status: 'success',
        token
      })
    } catch (error) {
      next(error)
    }
  },
  // feature: admin can see all users
  // route: GET /api/admin/users
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['role', 'password', 'email', 'introduction', 'createdAt', 'updatedAt'] },
        include: [
          { model: Tweet, raw: true },
          { model: Like, raw: true },
          { model: User, as: 'Followers', raw: true },
          { model: User, as: 'Followings', raw: true }
        ],
        nest: true
      })

      if (!users) throw new Error('Target users not exist.')

      const usersApiData = users
        .map((user) => {
          const { Tweets, Likes, Followings, Followers, ...restProps } = {
            ...user.toJSON(),
            tweetCounts: user.Tweets.length,
            likeCounts: user.Likes.length,
            followingCounts: user.Followings.length,
            followerCounts: user.Followers.length
          }
          return restProps
        })
        .sort((a, b) => b.tweetCounts - a.tweetCounts)

      res.json(usersApiData)
    } catch (error) {
      next(error)
    }
  },
  // feature: admin can see all tweets
  // route: GET /api/admin/tweets
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: {
          model: User,
          where: { role: 'user' },
          attributes: ['id', 'name', 'account', 'avatar']
        },
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })

      if (!tweets) throw new Error('Target tweets not exist.')

      const tweetsApiData = tweets.map((tweet) => {
        const { updatedAt, UserId, userId, User: user,  ...restProps } = tweet
        const description = tweet.description.substring(0, 50)
        return {
          ...restProps,
          user,
          description
        }
      })

      res.json(tweetsApiData)
    } catch (error) {
      next(error)
    }
  },
  // feature: admin can delete the specific tweet
  // route: DELETE /api/admin/tweets/:id
  deleteTweet: async (req, res, next) => {
    try {
      const reqTweetId = req.params.id
      const targetTweet = await Tweet.findByPk(reqTweetId)

      if (!Number(reqTweetId)) throw new Error('Params id is required.')
      if (!targetTweet) throw new Error('Target tweet not exist.')

      await targetTweet.destroy()
      await Reply.destroy({
        where: { tweet_id: reqTweetId }
      })
      await Like.destroy({
        where: { tweet_id: reqTweetId }
      })

      res.json({
        status: 'success'
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController

