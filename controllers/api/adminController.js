const db = require('../../models')
const User = db.User
const Like = db.Like
const Tweet = db.Tweet
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const adminController = {
  signIn: async (req, res) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return res.json({ status: 'error', message: "Required fields didn't exist." })
      }
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'No such user found.' })
      }
      if (user.role !== 'admin') {
        return res.status(401).json({ status: 'error', message: 'Permission denied.' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: "Password didn't match." })
      }

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      res.json({
        status: 'success',
        message: 'ok',
        token,
        user
      })
    } catch (error) {
      console.log(error)
    }
  },
  getUsers: async (req, res) => {
    try {
      let users = await User.findAll({
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Tweet, include: [Like] }
        ],
        where: { role: 'user' }
      })
      const countLen = (arr) => {
        let len = 0
        arr.forEach(ele => { len += ele.Likes.length })
        return len
      }
      users = users.map(user => ({
        ...user.dataValues,
        tweetCount: user.Tweets.length,
        likeCount: countLen(user.Tweets)
      }))
      users = users.sort((a, b) => b.tweetCount - a.tweetCount)
      return res.json(users)
    } catch (error) {
      console.log(error)
    }
  },
  getTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({ include: [User] })
      return res.json(tweets)
    } catch (error) {
      console.log(error)
    }
  },
  removeTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) {
        return res.json({ status: 'error', message: "This post doesn't exist." })
      }
      await tweet.destroy()
      return res.json({ status: 'success', message: 'This post was successfully removed' })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = adminController
