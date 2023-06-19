const { User, Tweet, Like } = require('../../models')
const jwt = require('jsonwebtoken')
const helpers = require('../../_helpers')

const userController = {
  signIn: (req, res) => {
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
  getTweets: (req, res) => {
    return Tweet.findAll({
      include: [
        { model: User },
      ],
      order: [['createdAt', 'DESC']],
    })
      .then(tweets => {
        if (!tweets)throw new Error('Tweets is not exist')
        const tweetsData = tweets.map(tweet => {
          tweet = tweet.toJSON()
          return {
            id:tweet.id,
            UserId:tweet.UserId,
            description: tweet.description.substring(0, 50),
            createdAt: tweet.createdAt,
            tweetOwnerName:tweet.User.name,
            tweetOwnerAccount: tweet.User.account,
            tweetOwnerAvatar: tweet.User.avatar
          }
        })
        res.status(200).json({ status: 'success', tweetsData })
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
        if (!users) throw new Error('Users is not exist')
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