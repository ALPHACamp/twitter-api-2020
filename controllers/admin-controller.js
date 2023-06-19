const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')
const jwt = require('jsonwebtoken')
// 之後加'../helpers/file-helpers'

const adminController = {
  login: async (req, res, next) => {
    try {
      const userData = await helpers.getUser(req)?.toJSON()
      delete userData.password
      const token = await jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      if (userData.role !== 'admin') throw new Error('帳號不存在!')
      return res.json({
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
  getUsers: async (req, res, next) => {
    try {
      let users = await User.findAll({
        attributes: ['id', 'name', 'account', 'avatar', 'cover'],
        include: [
          Tweet,
          { model: Tweet, include: [{ model: User, as: 'LikedUsers' }], attributes: ['id'] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      if (users.length === 0) throw new Error('資料庫中未找到使用者')
      users = await Promise.all(users.map(async user => ({
        ...user.toJSON(),
        likes: user.Tweets.LikedUsers?.length,
        postNum: user.Tweets.length,
        follower: user.Followings.length, // 跟隨者人數(被多少人跟隨)
        following: user.Followers.length // 跟隨人數(主動跟隨多少人)
      })))

      // 計算Likes
      const Likes = []
      for (let i = 0; i < users.length; i++) {
        let likesCounter = 0
        for (let j = 0; j < users[i].Tweets.length; j++) {
          const likes = users[i].Tweets[j].LikedUsers.length
          likesCounter += likes
        }
        Likes.push(likesCounter)
      }

      // 將Likes加入JSON
      users = await Promise.all(users.map(async (user, like) => ({
        id: user.id,
        name: user.name,
        account: user.account,
        avatar: user.avatar,
        cover: user.cover,
        likes: Likes[like],
        postNum: user.postNum,
        follower: user.follower,
        following: user.following
      })))

      // 排序
      users = users.sort((a, b) => b.PostNum - a.PostNum)

      return res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        include: [
          { model: User, attributes: ['id', 'name', 'avatar', 'account'] },
          Reply,
          Like,
          { model: User, as: 'LikedUsers' }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (tweets.length === 0) throw new Error('資料庫中未找到推文')
      tweets = await Promise.all(tweets.map(async tweet => {
        if (tweet.description.length > 50) {
          tweet.description = tweet.description.substring(0, 50) + '...'
          return tweet
        }
        return tweet
      }))
      const data = tweets.map(tweet => {
        return {
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          account: tweet.User.account,
          name: tweet.User.name,
          avatar: tweet.User.avatar,
          likedCount: tweet.Likes.length,
          repliedCount: tweet.Replies.length,
          isLiked: tweet.LikedUsers.map(t => t.id).includes(req.user.id)
        }
      })
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      let tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) throw new Error('資料庫中未找到推文')
      tweet = await tweet.destroy()
      return res.json({
        status: 'delete success',
        data: { tweet }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
