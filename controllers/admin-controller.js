const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')

const { User, Tweet, Like } = require('../models')

const adminController = {
  signin: async (req, res, next) => {
    try {
      const { account, password } = req.body

      // Check if any field remains blank
      if (!account?.trim() || !password?.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'All fields are required.'
        })
      }

      // Find admin
      const user = await User.findOne({
        raw: true,
        where: {
          account,
          role: 'admin'
        }
      })

      // Check if admin exists and password correct
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({
          status: 'error',
          message: 'Account or password incorrect.'
        })
      }

      // Generate token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      delete user.password

      return res.status(200).json({ token, user })
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const usersData = await User.findAll({
        attributes: [
          'id', 'account', 'name', 'avatar', 'cover',
          [
            sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'),
            'tweetCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Tweets INNER JOIN Likes ON Tweets.id = Likes.TweetId WHERE Tweets.UserId = User.id)'
            ),
            'likeCount'
          ]
        ],
        include: [
          { model: Tweet, include: [Like] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        order: [[sequelize.literal('tweetCount'), 'DESC']]
      })

      const users = usersData.map(user => {
        return {
          id: user.id,
          name: user.name,
          account: user.account,
          avatar: user.avatar,
          cover: user.cover,
          tweetCount: user.dataValues.tweetCount,
          likeCount: user.dataValues.likeCount,
          followingCount: user.Followings.length,
          followerCount: user.Followers.length
        }
      })

      return res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const { id } = req.params
      const tweet = await Tweet.findByPk(id)

      if (!id || !tweet) {
        return res.status(404).json({
          status: 'error',
          message: 'Invalid id parameter or no tweet was found'
        })
      }

      await tweet.destroy()
      return res.status(200).json({
        status: 'success',
        message: '1 tweet was deleted'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
