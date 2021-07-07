const db = require('../../models')
const Followship = db.Followship
const User = db.User
const defaultLimit = 10

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
  }
};

module.exports = followController;