const createToken = require('../helpers/token')
const tweetServices = require('../services/tweets')
const { Tweet, User, Followship, Like, Reply } = require('../models')

const adminController = {
  login: async (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      if (userData.role !== 'admin') throw new Error('非管理者')
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
  tweets: async (req, res, next) => {
    try {
      const tweets = await tweetServices.getAll()
      if (!(tweets.length)) throw new Error('推文不存在')

      tweets.forEach(element => {
        element.description = element.description.substring(0, 51)
      })
      res.json({
        status: 'success',
        data: tweets
      })
    } catch (err) {
      next(err)
    }
  },
  users: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: {
          exclude: ['createdAt', 'password', 'introduction', 'updatedAt']
        },
        raw: true
      })

      if (!users) throw new Error('沒有使用者')
      // 使用者發文總數
      const tweets = await Tweet.count({
        group: ['User_id']
      })
      if (!tweets.length) {
        for (let userIndex = 0; userIndex < users.length; userIndex++) {
          users[userIndex].totalTweetCount = 0
        }
      } else {
        for (let userIndex = 0; userIndex < users.length; userIndex++) {
          for (let tweetsIndex = 0; tweetsIndex < tweets.length; tweetsIndex++) {
            if (users[userIndex].id === tweets[tweetsIndex].User_id) {
              users[userIndex].totalTweetCount = tweets[tweetsIndex].count
            } else {
              if (users[userIndex].totalTweetCount === undefined) users[userIndex].totalTweetCount = 0
            }
          }
        }
      }
      // 使用者 like 總數
      const likes = await Like.count({
        group: ['User_id']
      })

      if (!likes.length) {
        for (let userIndex = 0; userIndex < users.length; userIndex++) {
          users[userIndex].totalLikeCount = 0
        }
      } else {
        for (let userIndex = 0; userIndex < users.length; userIndex++) {
          for (let likesIndex = 0; likesIndex < likes.length; likesIndex++) {
            if (users[userIndex].id === likes[likesIndex].User_id) {
              users[userIndex].totalLikeCount = likes[likesIndex].count
            } else {
              if (users[userIndex].totalLikeCount === undefined) users[userIndex].totalLikeCount = 0
            }
          }
        }
      }
      // 使用者的跟隨者總數
      const followers = await Followship.count({
        group: ['followerId'],
        raw: true
      })

      if (!followers.length) {
        for (let userIndex = 0; userIndex < users.length; userIndex++) {
          users[userIndex].followersCount = 0
        }
      } else {
        for (let userIndex = 0; userIndex < users.length; userIndex++) {
          for (let followerIndex = 0; followerIndex < followers.length; followerIndex++) {
            if (users[userIndex].id === followers[followerIndex].followerId) {
              users[userIndex].followersCount = followers[followerIndex].count
            } else {
              if (users[userIndex].followersCount === undefined) users[userIndex].followersCount = 0
            }
          }
        }
      }
      // 使用者追隨者總數
      const followings = await Followship.count({
        group: ['followingId'],
        raw: true
      })

      if (!followings.length) {
        for (let userIndex = 0; userIndex < users.length; userIndex++) {
          users[userIndex].followingsCount = 0
        }
      } else {
        for (let followingIndex = 0; followingIndex < followings.length; followingIndex++) {
          for (let userIndex = 0; userIndex < users.length; userIndex++) {
            if (users[userIndex].id === followings[followingIndex].followingId) {
              users[userIndex].followingsCount = followings[followingIndex].count
            } else {
              if (users[userIndex].followingsCount === undefined) users[userIndex].followingsCount = 0
            }
          }
        }
      }
      // const selectionSort = (arr) => {
      //   const length = arr.length
      //   for (let index = 0; index < length; index++) {
      //     let min = arr[index].totalTweetCount
      //     let minIndex = index
      //     let secIndex = index
      //     for (secIndex; secIndex < length; secIndex++) {
      //       console.log(arr[secIndex].totalTweetCount)
      //       console.log(min)
      //       console.log(arr[secIndex].totalTweetCount < min)
      //       if (arr[secIndex].totalTweetCount < min) {
      //         min = arr[secIndex].totalTweetCount
      //         minIndex = secIndex
      //       }
      //     }
      //     [arr[minIndex], arr[index]] = [arr[secIndex], arr[minIndex]]
      //   }
      //   return arr
      // }
      // selectionSort(users).reverse()

      res.status(200)
        .json(users)
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      await Like.destroy({
        where: {
          TweetId
        }
      })
      await Reply.destroy({
        where: {
          TweetId
        }
      })
      await Tweet.destroy({
        where: {
          id: TweetId
        }
      })
      res.json({
        status: 'success'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
