const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const db = require('../models')
const User = db.User
const Followship = db.Followship
const Tweet = db.Tweet
const Like = db.Like

module.exports = {
  login: (req, res) => {
    const { account, password } = req.body
    // validate user input
    if (!account || !password) {
      return res.status(400).json({ status: 'error', message: "Required fields didn't exist." })
    }

    // validate account and password
    User.findOne({ where: { account } }).then(user => {
      if (!user) return res.status(400).json({ status: 'error', message: 'Account does not exist.' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ status: 'error', message: 'Passwords does not match.' })
      }
      if (user.role === 'user') {
        return res.status(403).json({ status: 'error', message: 'Administrator only. User permission denied.' })
      }
      // issue a token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' })
      return res.status(200).json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          introduction: user.introduction,
          role: user.role,
          account: user.account,
          cover: user.cover,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      })
    })
      .catch(error => {
        const data = { status: 'error', message: error.toString() }
        console.log(error)
        return res.status(500).json(data)
      })
  },

  getUsers: (req, res) => {
    // TODO: 優化方向：撈使用者資料時一併把其他相關資料撈出來並排序
    const findAllUser = User.findAll({ raw: true, nest: true, attributes: ['id', 'name', 'avatar', 'account', 'cover'] })
    const findAllFollowship = Followship.findAll({ raw: true, nest: true, attributes: ['followingId', 'followerId'] })
    const findAllTweet = Tweet.findAll({ raw: true, nest: true, attributes: ['UserId'] })
    const findAllLike = Like.findAll({ raw: true, nest: true, attributes: ['UserId', 'TweetId'], include: Tweet })
    return Promise.all([findAllUser, findAllFollowship, findAllTweet, findAllLike])
      .then((values) => {
        const [users, followships, tweets, likes] = values
        users.forEach(user => {
          const userData = user
          userData.followerCount = followships.filter(followship => followship.followingId === user.id).length
          userData.followingCount = followships.filter(followship => followship.followerId === user.id).length
          userData.likedCount = likes.filter(like => like.Tweet.UserId === user.id).length
          userData.tweetCount = tweets.filter(tweet => tweet.UserId === user.id).length
          user = userData
        })

        users.sort((a, b) => b.tweetCount - a.tweetCount)
        return res.status(200).json(users)
      })
      .catch(error => {
        const data = { status: 'error', message: error.toString() }
        console.log(error)
        return res.status(500).json(data)
      })
  },

  getTweets: (req, res) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'description', 'createdAt'],
      include: { model: User, attributes: ['id', 'account', 'name', 'avatar'] }
    })
      .then(tweets => {
        tweets.forEach(tweet => {
          tweet.description = tweet.description.slice(0, 50)
        })
        return res.status(200).json(tweets)
      })
      .catch(error => {
        const data = { status: 'error', message: error.toString() }
        console.log(error)
        return res.status(500).json(data)
      })
  },
  deleteTweet: (req, res) => {
    const tweetId = req.params.id
    if (!validator.isNumeric(tweetId, { no_symbols: true })) {
      const data = { status: 'error', message: 'id should be an integer.' }
      return res.status(400).json(data)
    }
    Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) {
          const data = { status: 'error', message: 'The tweet you want to delete does not exist.' }
          return res.status(404).json(data)
        }
        tweet.destroy()
          .then(() => {
            const data = { status: 'success', message: 'Done.' }
            res.status(200).json(data)
          })
      })
      .catch(error => {
        const data = { status: 'error', message: error.toString() }
        console.log(error)
        return res.status(500).json(data)
      })
  }
}
