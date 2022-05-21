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
      res.status(200).json(tweets)
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
      if (tweets.length) {
        users.forEach(userElement => {
          tweets.forEach(element => {
            if (userElement.id === element.followerId) userElement.totalTweetNum = element.count
            else if (userElement.totalTweetNum === undefined) userElement.totalTweetNum = 0
          })
        })
      } else {
        users.forEach(userElement => {
          userElement.totalTweetNum = 0
        })
      }
      // 使用者 like 總數
      const totalTweets = await tweetServices.getAll()
      const totalTweetLikes = totalTweets.map(element => ({
        userId: element.userId,
        likeNum: element.likeNum
      }))

      users.forEach(userElement => {
        if (userElement.totalLikeNum === undefined) userElement.totalLikeNum = 0
      })

      users.forEach(userElement => {
        totalTweetLikes.forEach(element => {
          if (userElement.id === element.userId) userElement.totalLikeNum += element.likeNum
        })
      })

      // 使用者的跟隨者總數
      const followers = await Followship.count({
        group: ['followerId'],
        raw: true
      })
      if (followers.length) {
        users.forEach(userElement => {
          followers.forEach(element => {
            if (userElement.id === element.followerId) userElement.followersNum = element.count
            else if (userElement.followersNum === undefined) userElement.followersNum = 0
          })
        })
      } else {
        users.forEach(element => {
          element.followersNum = 0
        })
      }
      // 使用者追隨者總數
      const followings = await Followship.count({
        group: ['followingId'],
        raw: true
      })

      if (followings.length) {
        users.forEach(userElement => {
          followings.forEach(element => {
            if (userElement.id === element.followingId) userElement.followingsNum = element.count
            else if (userElement.followingsNum === undefined) userElement.followingsNum = 0
          })
        })
      } else {
        users.forEach(element => {
          element.followingsNum = 0
        })
      }

      function quickSort (arr) {
        if (arr.length < 2) return arr
        const [first, ...ary] = arr
        const left = []
        const right = []

        ary.forEach(second => {
          if (second.totalTweetNum < first.totalTweetNum) left.push(second)
          else right.push(second)
        })

        return [...quickSort(left), first, ...quickSort(right)]
      }

      const data = quickSort(users).reverse()

      res.status(200)
        .json(data)
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const tweet = await Tweet.findOne({
        where: {
          id: TweetId
        }
      })
      if (!tweet) throw new Error('貼文不存在')
      await Like.destroy({
        where: {
          Tweet_id: TweetId
        }
      })
      await Reply.destroy({
        where: {
          Tweet_id: TweetId
        }
      })
      await Tweet.destroy({
        where: {
          id: TweetId
        }
      })
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
