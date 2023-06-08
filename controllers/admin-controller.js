const { User, Tweet } = require('../models')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const adminController = {
  signIn: (req, res, next) => {
    const { account, password } = req.body
    if (!account || !password)
      throw new Error("Account and password are required")
    return User.findOne({
      where: { account }
    })
      .then((user) => {
        if (!user) throw new Error("Admin 權限不存在")
        if (user.role === "user") throw new Error("Admin 權限不存在")
        if (!bcrypt.compareSync(password, user.password))
          throw new Error("密碼不相符")
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, {
          expiresIn: "30d",
        })
        return res.status(200).json({
          token,
          user: userData,
        })
      })
      .catch((err) => next(err));
  },

  // function still need to be modified
  getUsers: (req, res, next) => {
    User.findAll({
      include: [
        Tweet,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
      ],
      raw: true,
      nest: true,
    })
      .then((users) => {
        console.log(users)
        return res.status(200).json(users)
      })
      .catch((err) => next(err))
  },

  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: User,
      nest: true,
      raw: true
    })
      .then((tweets) => {
        if (!tweets) { return res.status(404).json({ status: 'error', message: 'No tweets found' }) }
        return res.status(200).json(tweets)
      })
      .catch((err) => next(err))
  },

  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        // Error: tweet doesn't exist
        if (!tweet) {
          return res.status(404).json({ status: 'error', message: 'No tweets found' })
        }
        // keep the deleted data
        const deletedTweet = tweet.toJSON()
        return tweet.destroy()
          .then(() => {
            return res.status(200).json({ status: 'success', message: 'Tweet deleted', deletedTweet })
          })
      })
      .catch(err => next(err))
  }
}
module.exports = adminController