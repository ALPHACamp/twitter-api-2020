const db = require('../../models')
const { Op } = require('sequelize')
const Followship = db.Followship
const User = db.User
const defaultLimit = 10

let followController = {
  getUserFollowings: (req, res) => {
    const options = {
      where: { followerId: +req.params.id },
      limit: +req.query.limit || defaultLimit,
      offset: +req.query.offset || 0,
      include: {
        model: User,
        as: 'following',
        attributes: [
          'id',
          'account',
          'name',
          'avatar',
          'introduction',
          'likeNum',
          'tweetNum',
          'followingNum',
          'followerNum'
        ],
        include: [
          {
            model: User,
            as: 'Followers',
            attributes: ['id'],
            through: {
              attributes: []
            }
          }
        ]
      },
      attributes: ['id', 'followingId', 'followerId', 'createdAt'],
      order: [['createdAt', 'desc']]
    }
    Followship.findAll(options)
      .then((followships) => {
        followships = followships.map((followship) => {
          const following = followship.following.dataValues
          following.isFollowing = following.Followers.some(
            (user) => user.id === +req.user.id
          )
          delete following.Followers
          return followship
        })
        return res.status(200).json(followships)
      })
      .catch((error) =>
        res.status(500).json({
          status: 'error',
          message: error
        })
      )
  },
  getUserFollowers: (req, res) => {
    const options = {
      where: { followingId: +req.params.id },
      limit: +req.query.limit || defaultLimit,
      offset: +req.query.offset || 0,
      include: {
        model: User,
        as: 'follower',
        attributes: [
          'id',
          'account',
          'name',
          'avatar',
          'introduction',
          'likeNum',
          'tweetNum',
          'followingNum',
          'followerNum'
        ],
        include: [
          {
            model: User,
            as: 'Followers',
            attributes: ['id'],
            through: {
              attributes: []
            }
          }
        ]
      },
      attributes: ['id', 'followingId', 'followerId', 'createdAt'],
      order: [['createdAt', 'desc']]
    }
    Followship.findAll(options)
      .then((followships) => {
        followships = followships.map((followship) => {
          const follower = followship.follower.dataValues
          follower.isFollowing = follower.Followers.some(
            (user) => user.id === +req.user.id
          )
          delete follower.Followers
          return followship
        })
        return res.status(200).json(followships)
      })
      .catch((error) =>
        res.status(500).json({
          status: 'error',
          message: error
        })
      )
  },
  postFollowship: (req, res) => {
    if (+req.user.id === +req.body.id) {
      return res.status(400).json({
        status: 'error',
        message: 'Not allow to self-follow.'
      })
    }
    Followship.findOne({
      where: {
        followerId: +req.user.id,
        followingId: +req.body.id
      }
    }).then((followship) => {
      //if already follow
      if (followship) {
        return res.status(400).json({
          status: 'error',
          message: 'You are already following this user.'
        })
      }
      Followship.create({
        followerId: +req.user.id,
        followingId: +req.body.id
      }).then((followship) => {
        //followerUser followingNum +1 & followingUser followerNum +1
        Promise.all([
          User.findByPk(+req.user.id).then((currentUser) =>
            currentUser.increment({ followingNum: 1 })
          ),
          User.findByPk(+req.body.id).then((followingUser) =>
            followingUser.increment({ followerNum: 1 })
          )
        ])
          .then(() =>
            res.status(200).json({
              status: 'success',
              message: 'Successfully followed user.'
            })
          )
          .catch((error) =>
            res.status(500).json({
              status: 'error',
              message: error
            })
          )
      })
    })
  },
  deleteFollowship: (req, res) => {
    Followship.findOne({
      where: {
        followerId: +req.user.id,
        followingId: +req.params.id
      }
    }).then((followship) => {
      if (!followship) {
        return res.status(400).json({
          status: 'error',
          message: 'This Follow does not exist.'
        })
      }
      followship.destroy().then(() => {
        Promise.all([
          User.findByPk(+req.user.id).then((currentUser) =>
            currentUser.decrement({ followingNum: 1 })
          ),
          User.findByPk(+req.params.id).then((followingUser) =>
            followingUser.decrement({ followerNum: 1 })
          )
        ])
          .then(() =>
            res.status(200).json({
              status: 'success',
              message: 'Successfully unfollowed user.'
            })
          )
          .catch((error) =>
            res.status(500).json({
              status: 'error',
              message: error
            })
          )
      })
    })
  },
  getNotFollowingUsers: (req, res) => {
    Followship.findAll({
      where: { followerId: +req.user.id },
      attributes: ['followingId']
    }).then((followships) => {
      const followings = followships.map((followship) => followship.followingId)
      const options = {
        where: {
          [Op.not]: { id: { [Op.or]: followings } },
          role: 'user'
        },
        attributes: ['id', 'name', 'account', 'avatar'],
        order: [['followerNum', 'desc']],
        limit: +req.query.limit || defaultLimit,
        offset: +req.query.offset || 0
      }
      followings.push(+req.user.id)
      User.findAll(options)
        .then((users) => {
          res.status(200).json(users)
        })
        .catch((error) =>
          res.status(500).json({
            status: 'error',
            message: error
          })
        )
    })
  },
  toggleSubscribe: (req, res) => {
    Followship.findOne({
      where: {
        followerId: +req.user.id,
        followingId: +req.body.id
      }
    }).then((followship) => {
      if (!followship) {
        return res.status(400).json({
          status: 'error',
          message: 'Should follow first.'
        })
      }
      let message, isSubscribing
      if (followship.isSubscribing) {
        isSubscribing = false
        message = 'Successfully cancel subscription of user.'
      } else {
        isSubscribing = true
        message = 'Successfully subscribe user.'
      }
      followship.update({ isSubscribing }).then(() =>
        res.status(200).json({
          status: 'success',
          message
        })
      )
    })
  }
}

module.exports = followController
