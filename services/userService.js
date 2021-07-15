const db = require('../models')
const { User, Tweet, Like, Reply, Followship, Sequelize } = db

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
  },
  getUserLikes: (req, res, viewerRole, UserId, viewerId) => {
    return User.findByPk(UserId)
      .then(user => {
        if (!user) {
          return res.status(400).json({
            status: 'error',
            message: 'This user does not exist.'
          })
        }
      }).then(user => {
        return Like.findAll({
          include: [
            {
              model: Tweet,
              attributes: ['id', 'description', 'createdAt', 'replyCount', 'likeCount']
            },
            {
              model: User,
              attributes: ['id', 'name', 'account', 'avatar']
            }
          ],
          where: { UserId },
          attributes: ['TweetId'],
          order: [
            ['createdAt', 'DESC']
          ]
        }).then(likes => {
          likes = likes.map((like, i) => {
            const userObj = {
              ...like.User.dataValues
            }

            const mapItem = {
              ...like.dataValues,
              ...like.Tweet.dataValues,
              isLike: like.User.id === viewerId
            }

            delete mapItem.Tweet
            delete mapItem.id
            delete mapItem.User

            mapItem.User = userObj

            if (viewerRole === 'admin') {
              delete mapItem.isLike
            }

            return mapItem
          })

          return res.status(200).json(likes)
        })
      })
  },
  getUserFollowings: (req, res, viewerRole, UserId, viewerId) => {
    return User.findByPk(UserId)
      .then(user => {
        if (!user) {
          return res.status(400).json({
            status: 'error',
            message: 'This user does not exist.'
          })
        }
      }).then(user => {
        return User.findAll({
          include: [
            {
              model: User,
              as: 'Followings',
              attributes: ['id', 'name', 'account', 'avatar', 'introduction'],
              nest: true,

              include: {
                model: User,
                as: 'Followers',
                attributes: ['id'],
                where: { id: viewerId },
                nest: true,
                required: false
              }
            }
          ],
          where: { id: UserId },
          attributes: [],
          nest: true,
          raw: true,
          order: [[{ model: User, as: 'Followings' }, 'createdAt', 'DESC']]
        }).then(async data => {
          data = data.map((item, i) => {
            const mapItem = {
              ...item.dataValues,
              followingId: item.Followings.id,
              Followings: {
                ...item.Followings,
                isFollowing: Boolean(item.Followings.Followers.id)
              }
            }
            delete mapItem.Followings.Followship
            delete mapItem.Followings.Followers.Followship
            delete mapItem.Followings.Followers

            if (viewerRole === 'admin') {
              delete mapItem.Followings.isFollowing
            }
            return mapItem
          })
          return res.status(200).json(data)
        })
      })
  },
  getUserFollowers: (req, res, viewerRole, UserId, viewerId) => {
    return User.findByPk(UserId)
      .then(user => {
        if (!user) {
          return res.status(400).json({
            status: 'error',
            message: 'This user does not exist.'
          })
        }
      }).then(user => {
        return User.findAll({
          include: [
            {
              model: User,
              as: 'Followers',
              attributes: ['id', 'name', 'account', 'avatar', 'introduction'],
              nest: true,

              include: {
                model: User,
                as: 'Followers',
                attributes: ['id'],
                where: { id: viewerId },
                nest: true,
                required: false
              }
            }
          ],
          where: { id: UserId },
          attributes: [],
          nest: true,
          raw: true,
          order: [[{ model: User, as: 'Followers' }, 'createdAt', 'DESC']]
        }).then(async data => {
          data = data.map((item, i) => {
            const mapItem = {
              ...item.dataValues,
              followerId: item.Followers.id,
              Followers: {
                ...item.Followers,
                isFollowing: Boolean(item.Followers.Followers.id)
              }
            }
            delete mapItem.Followers.Followship
            delete mapItem.Followers.Followers.Followship
            delete mapItem.Followers.Followers

            if (viewerRole === 'admin') {
              delete mapItem.Followers.isFollowing
            }

            return mapItem
          })
          return res.status(200).json(data)
        })
      })
  },
  getUserRepliedTweets: (req, res, viewerRole, UserId, viewerId) => {
    return User.findByPk(UserId)
      .then(user => {
        if (!user) {
          return res.status(400).json({
            status: 'error',
            error: 'This user does not exist.'
          })
        }
      }).then(user => {
        return Reply.findAll({
          where: { UserId },
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
            {
              model: Tweet,
              attributes: ['id', 'description', 'replyCount', 'likeCount'],
              include: { model: Like, separate: true, where: { UserId: viewerId }, required: false }
            }
          ],
          attributes: ['id', 'comment'],
          nest: true,
          order: [[Reply.associations.Tweet, 'createdAt', 'DESC']]
        }).then(replies => {
          replies = replies.map((item, i) => {
            const userObj = {
              ...item.User.dataValues
            }

            const mapItem = {
              TweetId: item.dataValues.Tweet.dataValues.id,
              ...item.dataValues,
              ...item.dataValues.Tweet.dataValues,
              isLike: Boolean(item.Tweet.Likes[0])
            }
            delete mapItem.Tweet
            delete mapItem.Likes
            delete mapItem.id
            delete mapItem.User

            if (viewerRole === 'admin') {
              delete mapItem.isLike
            }

            mapItem.User = userObj

            return mapItem
          })
          return res.status(200).json(replies)
        })
      })
  }
}

module.exports = userService
