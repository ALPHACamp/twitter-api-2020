const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like } = require('../../models')
const jwt = require('jsonwebtoken')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
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
  }
}

module.exports = userController