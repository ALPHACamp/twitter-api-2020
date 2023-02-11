const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like } = require('../models')
const helpers = require('../_helpers')


const adminController = {
  signIn: (req, res, next) => {
    try {
      if (helpers.getUser(req) && helpers.getUser(req).role !== 'admin') {
        return res.status(403).json({ status: 'error', message: "此帳號不存在！" })
      }

      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.status(200).json({
        status: 'success',
        data: {
          token,
          user: userData
        },
        message: '成功登入！'
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: (req, res, next) => {

    User.findAll({
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Like, include: Tweet }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(users => {
        const result = users
          .map(user => {
            return {
            id: user.id,
            account: user.account,
            name: user.name,
            avatar: user.avatar,
            cover: user.cover,
            followerCount: user.Followers.length,
            followingCount: user.Followings.length,
            tweetCount: user.Tweets.length,
            likeCount: user.Likes.length
          }})
          .sort((a, b) => b.tweetCount - a.tweetCount)

        return result
      })
      .then(data => res.status(200).json(data))
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: User,
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const result = tweets.map(tweet => ({
          id: tweet.id,
          UserId: tweet.UserId,
          account: tweet.User.account,
          name: tweet.User.name,
          avatar: tweet.User.avatar,
          description: tweet.description.substring(0, 50),
          createdAt: tweet.createdAt
        }))
        return result
      })
      .then(data => res.status(200).json(data))
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    Tweet.findByPk(req.params.id, {
      include: [
        Reply,
        Like
      ]
    })
      .then(tweet => {
  
        if (!tweet) throw new Error('此推文已不存在！')
        
        tweet.Replies.map(reply => reply.destroy())
        tweet.Likes.map(like => like.destroy({ force: true }))
        
        return tweet.destroy()
      })

      .then(data => res.status(200).json({
        status: 'success',
        message: '推文已刪除',
        data
      }))
      .catch(err => next(err))
  }

}

module.exports = adminController
