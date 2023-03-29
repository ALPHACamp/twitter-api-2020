const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { User, Tweet, Reply, Like } = require('../models')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
const sequelize = require('sequelize')

const adminController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()

      if (userData.role !== 'admin') throw new Error('Account or password is wrong!')

      const authToken = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })

      delete userData.password
      delete userData.role
      res.json({
        status: 'success',
        authToken,
        data: {
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      attributes: ['id', 'name', 'account', 'avatar', 'cover',
        [
          sequelize.literal('(SELECT COUNT(*) FROM tweets WHERE tweets.UserId = user.id)'), 'tweetCounts'
        ],
        [
          sequelize.literal('(SELECT COUNT(*) FROM tweets RIGHT OUTER JOIN likes ON tweets.id=likes.TweetId WHERE tweets.UserId = user.id)'), 'beLikedCounts'
        ],
        [
          sequelize.literal('(SELECT COUNT(*) FROM followships WHERE followships.followingId = user.id)'), 'followerCounts'
        ],
        [
          sequelize.literal('(SELECT COUNT(*) FROM followships WHERE followships.followerId = user.id)'), 'followingCounts'
        ]
      ],
      order: [
        [sequelize.literal('tweetCounts'), 'DESC']
      ],
      raw: true
    })
      .then(users => res.json(users))
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      attributes: {
        include: [
          [
            sequelize.literal('(SELECT SUBSTR(description,1,50) FROM tweets WHERE tweets.id = tweet.id)'), 'description'
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM replies WHERE replies.TweetId = tweet.id)'), 'replyCounts'
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM likes WHERE likes.TweetId = tweet.id)'), 'likeCounts'
          ]
        ]
      },
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ]
    })
      .then(tweets => {
        const tweetsData = tweets.map(tweet => {
          const data = {
            ...tweet.toJSON(),
            period: dayjs(tweet.createdAt).fromNow()
          }
          return data
        })

        res.json(tweetsData)
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    const TweetId = Number(req.params.id)
    return Promise.all([
      Tweet.findByPk(TweetId),
      Reply.findAll({
        where: { TweetId },
        attributes: ['id']
      }),
      Like.findAll({
        where: { TweetId },
        attributes: ['id']
      })
    ])
      .then(([tweet, replies, likes]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        // 刪除與此推文相關的reply及like
        Promise.all([
          replies.map(reply => reply.destroy()),
          likes.map(like => like.destroy())
        ])
        return tweet.destroy()
      })
      .then(deletedTweet => res.json(deletedTweet))
      .catch(err => next(err))
  }
}

module.exports = adminController
