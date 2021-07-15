const db = require('../models')
const { User, Tweet, Like, Followship, Sequelize } = db

const userService = {
  getUser: (req, res, viewerRole, UserId) => {
    return User.findByPk(UserId)
      .then(user => {
        if (!user) {
          return res.status(401).json({ status: 'error', message: 'User not found.' })
        }
        const { id, name, account, avatar, cover, introduction, followerCount, followingCount } = user
        return res.status(200).json({
          id, name, account, avatar, cover, introduction, followerCount, followingCount
        })
      })
  },
  getUserTweets: (req, res, viewerRole, UserId, viewerId) => {
    let attributesOption = []

    switch (viewerRole) {
      case 'user':
        attributesOption = [
          ['id', 'TweetId'],
          'description', 'createdAt', 'replyCount', 'likeCount',
          [Sequelize.literal(`exists (select * from Likes where Likes.UserId = '${viewerId}' and Likes.TweetId = Tweet.id)`), 'isLike']
        ]
        break

      case 'admin':
        attributesOption = [
          ['id', 'TweetId'],
          'description', 'createdAt', 'replyCount', 'likeCount'
        ]
        break
    }

    return User.findByPk(UserId)
      .then(user => {
        if (!user) {
          return res.status(400).json({
            status: 'error',
            message: 'This user does not exist.'
          })
        }
        return Tweet.findAll({
          where: { UserId },
          attributes: attributesOption,
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'account', 'avatar']
            },
            {
              model: Like, attributes: []
            }
          ],
          order: [['createdAt', 'DESC']]
        }).then(tweets => {
          if (viewerRole === 'user') {
            tweets.forEach(tweet => {
              tweet.dataValues.isLike = Boolean(tweet.dataValues.isLike)
            })
          }
          return res.status(200).json(tweets)
        })
      })
  }
}

module.exports = userService
