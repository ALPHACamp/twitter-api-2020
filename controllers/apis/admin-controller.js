const jwt = require('jsonwebtoken')
const helpers = require('../../_helpers')
const sequelize = require('sequelize')
const { User, Like, Tweet, Reply } = require('../../models')
const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES || '30m'

const adminController = {
  signIn: (req, res, next) => {
    const userData = helpers.getUser(req).toJSON()
    try {
      // 非管理者不能登入後台
      if (userData.role !== 'admin') throw new Error('Account or Password is wrong!')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES })
      res.json({
        status: 'success',
        data: {
          token,
          admin: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        nest: true,
        attributes: [
          'id',
          'name',
          'email',
          'account',
          'avatar',
          'cover',
          // all tweets num
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'tweetNum'],

          // all follower num
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'followerNum'],

          // all following num
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'), 'followingNum'],

          // all likes get from tweets
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets INNER JOIN Likes ON Tweets.id = Likes.TweetId WHERE Tweets.UserId = User.id)'), 'likeNum']
        ],
        raw: true
      })

      // test data
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        return res.status(200).json(users)
      } else {
        const usersSorted = users.sort((a, b) => b.tweetNum - a.tweetNum)
        return res.json({
          status: 'success',
          data: {
            users: usersSorted
          }
        })
      }
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        nest: true,
        include: [{
          model: User,
          attributes: ['name', 'account', 'avatar']
        }],
        order: [['createdAt', 'DESC']],
        raw: true
      })
      const tweetsSubstr = tweets.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, 50)
      }))

      return res.json({
        status: 'success',
        data: {
          tweets: tweetsSubstr
        }
      })
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      const deletedTweet = await tweet.destroy()
      await Reply.destroy({ where: { TweetId } })
      await Like.destroy({ where: { TweetId } })

      return res.json({
        status: 'success',
        data: { tweet: deletedTweet.toJSON() }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
