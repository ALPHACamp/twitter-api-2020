const { User, Tweet } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')
const moment = require('moment')

const adminController = {
  signIn: (req, res, next) => {
    const { account, password } = req.body
    if (!account || !password)
      throw new Error('Account and password are required')
    return User.findOne({
      where: { account }
    })
      .then((user) => {
        if (!user) throw new Error('Admin not exists')
        if (user.role === 'user') throw new Error('Admin not exists')
        if (!bcrypt.compareSync(password, user.password))
          throw new Error('Password incorrect')
        const adminData = user.toJSON()
        delete adminData.password
        const token = jwt.sign(adminData, process.env.JWT_SECRET, {
          expiresIn: '30d'
        })
        return res.status(200).json({
          status: 'success',
          message: 'Login successful',
          data: {
            token,
            admin: adminData,
          }
        })
      })
      .catch((err) => next(err))
  },

  getUsers: (req, res, next) => {
    return User.findAll({
      attributes: {
        include: [
          // user data
          [
            Sequelize.literal(
              "(SELECT COUNT(id) FROM Tweets WHERE Tweets.user_id = user.id)"
            ),
            "tweetCount"
          ],
          [
            Sequelize.literal(
              "(SELECT COUNT(id) FROM Likes WHERE Likes.user_id = user.id)"
            ),
            "likeCount"
          ],
          [
            Sequelize.literal(
              "(SELECT COUNT(DISTINCT id) FROM Followships WHERE Followships.following_id = user.id)"
            ),
            "followerCount"
          ],
          [
            Sequelize.literal(
              "(SELECT COUNT(DISTINCT id) FROM Followships WHERE Followships.follower_id = user.id)"
            ),
            "followingCount"
          ]
        ],
        exclude: ["password", "createdAt", "updatedAt", "role"]},
      raw: true,
      nest: true,
    })
      .then((users) => {
        const result = users
        // sort by tweets count
        .sort(
          (a, b) =>
            b.tweetCount - a.tweetCount
        )
        return res.status(200).json(result)
      })
      .catch((err) => next(err))
  },

  getTweets: (req, res, next) => {
    return Tweet.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: { exclude: ["password", "createdAt", "updatedAt", "role", "introduction"] }
        }
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(`TIMESTAMPDIFF(SECOND, Tweet.created_at, NOW())`),
            "diffCreatedAt"
          ],
          [
            Sequelize.literal(
              "(SELECT COUNT(DISTINCT id) FROM Replies WHERE Replies.tweet_id = tweet.id)"
            ),
            "replyCount"
          ],
          [
            Sequelize.literal(
              "(SELECT COUNT(DISTINCT id) FROM Likes WHERE Likes.tweet_id = tweet.id)"
            ),
            "likeCount"
          ]
        ],
        exclude: ["UserId"]
      },
      nest: true,
      raw: true
    })
      .then((tweets) => {
        if (!tweets) throw new Error('No tweets found')
        const processedTweets = tweets.map((tweet) => {
          const createdAt = moment(tweet.createdAt).format('YYYY-MM-DD HH:mm:ss')
          const updatedAt = moment(tweet.updatedAt).format('YYYY-MM-DD HH:mm:ss')
          const diffCreatedAt = moment().subtract(tweet.diffCreatedAt, 'seconds').fromNow()
          return {
            ...tweet,
            createdAt,
            updatedAt,
            diffCreatedAt
          }
        })
        return res.status(200).json(processedTweets)
      })
      .catch((err) => next(err))
  },

  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        // Error: tweet doesn't exist
        if (!tweet) throw new Error('No tweet found')
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