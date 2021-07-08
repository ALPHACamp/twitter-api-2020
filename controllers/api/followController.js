const db = require('../../models')
const Followship = db.Followship
const User = db.User
const defaultLimit = 10
let currentUserId = 1

let followController = {
    getUserFollowings: (req, res) => {
    const options = {
      where: { followerId: req.params.id },
      limit: +req.query.limit || defaultLimit,
      offset: +req.query.offset || 0,
      include: {
        model: User,
        as: "following",
        attributes: ['id', 'account', 'name', 'avatar',
          'likeNum', 'tweetNum', 'followingNum', 'followerNum']
      },
      attributes: ['id', 'followingId', 'followerId'],
      order: [[{ model: User, as: "following" }, 'followerNum', 'desc']]
    }
    Followship.findAll(options)
      .then(followings => {
        return res.status(200).json(followings)
      }).catch(error => res.status(500).json({ status: 'error', message: error }))
  },
  postFollowship: (req, res) => {
    Followship.create({ followerId: currentUserId, followingId: req.body.id })
      .then(followship => {
        Promise.all([
          User.findByPk(currentUserId).then((currentUser) =>
            currentUser.increment({ followingNum: 1 })
          ),
          User.findByPk(req.body.id).then((followingUser) =>
            followingUser.increment({ followerNum: 1 })
          )
        ])
          .then(() =>
            res
              .status(200)
              .json({ status: 'success', message: 'Successfully followed user.' })
          )
          .catch((error) =>
            res.json(500).json({ status: 'error', message: error })
          )
      })
  },
  deleteFollowship: (req, res) => {
    Followship.findOne({ where: { followerId: currentUserId, followingId: req.params.id } })
      .then(followship => {
        followship.destroy().then(() => {
          Promise.all([
            User.findByPk(currentUserId).then((currentUser) =>
              currentUser.decrement({ followingNum: 1 })
            ),
            User.findByPk(req.params.id).then((followingUser) =>
              followingUser.decrement({ followerNum: 1 })
            )
          ])
            .then(() =>
              res
                .status(200)
                .json({ status: 'success', message: 'Successfully unfollowed user.' })
            )
            .catch((error) =>
              res.json(500).json({ status: 'error', message: error })
            )
        })
      })
  }
}

module.exports = followController;