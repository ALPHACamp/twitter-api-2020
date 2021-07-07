const db = require('../../models')
const Followship = db.Followship
const User = db.User
const defaultLimit = 10

let followController = {
  getUserFollowers: (req, res) => {
    const options = {
      where: { followingId: req.params.id },
      limit: +req.query.limit || defaultLimit,
      offset: +req.query.offset || 0,
      order: [['createdAt', 'desc']],
      include: {
        model: User,
        as: "follower",
        attributes: ['id', 'account', 'name', 'avatar',
          'likeNum', 'tweetNum', 'followingNum', 'followerNum']
      },
      attributes: ['id', 'followingId', 'followerId']
    }
    Followship.findAll(options)
      .then(followers => {
        return res.status(200).json(followers)
      }).catch(error => res.status(500).json({ status: 'error', message: error }))
  }
};

module.exports = followController;