const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like } = require('../../models')
const jwt = require('jsonwebtoken')
const helpers = require('../../_helpers')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.role !== 'admin') throw new Error('Account does not exist!')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message })
    }
  },
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [
        { model: User },
        { model: Reply },
        { model: Like }
      ],
      order: [['createdAt', 'DESC']],
    })
      .then(ts => {
        const tweets = ts.map(tweet => {
          const tweetJSON = tweet.toJSON()
          delete tweetJSON.User.password
          return {
            ...tweetJSON,
            description: tweet.description.substring(0, 50),
            RepliesCount: tweet.Replies.length,
            LikesCount: tweet.Likes.length
          }
        })
        res.status(200).json({ status: 'success', tweets })
      })
      .catch(err => {
        res.status(500).json({ status: 'error', error: err.message })
      })
  },
  deleteTweet: (req, res) => {
    return Tweet.findByPk(req.params.tweetId)
      .then(tweet => {
        if (!tweet) throw new Error(`Tweet didn't exist`)
        return tweet.destroy()
      })
      .then(deletedTweet => res.status(200).json({ status: 'success', deletedTweet }))
      .catch(err => res.status(500).json({ status: 'error', error: err.message }))
  },
  getUsers: (req, res) => {
    return User.findAll({
      include: [
        { model: Tweet, include: [Like] },
        // through: { attributes: [] }=>不含中間表
        { model: User, as: 'Followers', through: { attributes: [] } },
        { model: User, as: 'Followings', through: { attributes: [] } },
      ]
    })
      .then(users => {
        const userData = users.map(user => {
          let userJson = user.toJSON()
          delete userJson.password
          let likedTweetsCount = 0
          for (let i = 0; i < userJson.Tweets.length; i++) {
            likedTweetsCount += userJson.Tweets[i].Likes.length
          }
          userJson.Followers = userJson.Followers.map(follower => {
            delete follower.password
            return follower
          })
          userJson.Followings = userJson.Followings.map(following => {
            delete following.password
            return following
          })

          return {
            ...userJson,
            tweetsCount: userJson.Tweets.length,
            followersCount: userJson.Followers.length,
            followingsCount: userJson.Followings.length,
            likedTweetsCount
          }
        })
        userData.sort((a, b) => b.tweetsCount - a.tweetsCount)
        res.status(200).json(userData)
      })
      .catch(err => res.status(500).json({ status: 'error', error: err.message }))
  }
}

module.exports = userController