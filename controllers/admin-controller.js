const createToken = require('../helpers/token')
const tweetServices = require('../services/tweets')
const { Tweet, User, Followship, Like } = require('../models')

const adminController = {
  login: async (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      if (userData.role !== 'admin') res.status(403).json({ status: 'error', message: '非管理者' })
      const token = await createToken(userData)
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  tweets: async (req, res) => {
    try {
      const tweets = await tweetServices.getAll()
      if (!(tweets.length)) return res.status(403).json({ status: 'error', message: '推文不存在' })
      tweets.forEach(element => {
        element.description = element.description.substring(0, 51)
      })
      res.json({
        status: 'success',
        data: {
          data: tweets
        }
      })
    } catch (err) {
      console.log(err)
    }
  },
  users: async (req, res) => {
    try {
      const users = await User.findAll({
        where: {
          role: 'user'
        },
        attributes: {
          exclude: ['createdAt', 'password', 'introduction', 'updatedAt']
        },
        raw: true
      })
      const followers = await Followship.count({
        group: ['followerId'],
        raw: true
      })
      const followings = await Followship.count({
        group: ['followingId'],
        raw: true
      })

      const tweets = await Tweet.count({
        group: ['User_id']
      })

      const likes = await Like.count({
        group: ['User_id']
      })

      // 使用者發文總數

      if (!tweets.length) {
        for (let userIndex = 0; userIndex < users.length; userIndex++) {
          users[userIndex].totalTweetCount = 0
        }
      }

      for (let tweetsIndex = 0; tweetsIndex < tweets.length; tweetsIndex++) {
        for (let userIndex = 0; userIndex < users.length; userIndex++) {
          if (users[userIndex].id === tweets[tweetsIndex].User_id) {
            users[userIndex].totalTweetCount = tweets[tweetsIndex].count
          } else {
            if (users[userIndex].totalTweetCount === undefined) users[userIndex].totalTweetCount = 0
          }
        }
      }

      // 使用者 like 總數

      if (!likes.length) {
        for (let userIndex = 0; userIndex < users.length; userIndex++) {
          users[userIndex].totalLikeCount = 0
        }
      }

      for (let likesIndex = 0; likesIndex < likes.length; likesIndex++) {
        for (let userIndex = 0; userIndex < likes.length; userIndex++) {
          if (users[userIndex].id === likes[likesIndex].User_id) {
            users[userIndex].totalLikeCount = likes[likesIndex].count
          } else {
            if (users[userIndex].totalLikeCount === undefined) users[userIndex].totalLikeCount = 0
          }
        }
      }

      // 使用者的跟隨者總數

      if (!followers.length) {
        for (let userIndex = 0; userIndex < users.length; userIndex++) {
          users[userIndex].followersCount = 0
        }
      }

      for (let followerIndex = 0; followerIndex < followers.length; followerIndex++) {
        for (let userIndex = 0; userIndex < users.length; userIndex++) {
          if (users[userIndex].id === followers[followerIndex].followerId) {
            users[userIndex].followersCount = followers[followerIndex].count
          } else {
            if (users[userIndex].followersCount === undefined) users[userIndex].followersCount = 0
          }
        }
      }

      // 使用者追隨者總數

      if (!followings.length) {
        for (let userIndex = 0; userIndex < users.length; userIndex++) {
          users[userIndex].followingsCount = 0
        }
      }

      for (let followingIndex = 0; followingIndex < followings.length; followingIndex++) {
        for (let userIndex = 0; userIndex < users.length; userIndex++) {
          console.log(users[userIndex])
          if (users[userIndex].id === followings[followingIndex].followingId) {
            users[userIndex].followingsCount = followings[followingIndex].count
          } else {
            if (users[userIndex].followingsCount === undefined) users[userIndex].followingsCount = 0
          }
        }
      }

      if (!users) return res.status(403).json({ status: 'error', message: '沒有使用者' })
      res.status(200)
        .json(users)
    } catch (err) {
      console.log(err)
    }
  },
  deleteTweet: async (req, res) => {
    try {
      const tweetId = req.params.id
      await Tweet.destroy({
        where: {
          id: tweetId
        }
      })
      res.json({
        status: 'success'
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = adminController
