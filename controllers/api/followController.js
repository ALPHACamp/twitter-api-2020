const db = require('../../models')
const Followship = db.Followship
const User = db.User

let followController = {
  getUserFollowings: (req, res) => {
    const options = {
      where: { followerId: req.params.id },
      include: {
        model: User,
        as: "following",
        attributes: ['id', 'account', 'name', 'avatar']
      },
      attributes: ['id', 'followingId', 'followerId']
    }
    Followship.findAll(options)
      .then(followings => {
        return res.status(200).json(followings)
      }).catch(error => res.status(500).json({ status: 'error', message: error }))
  }
};

module.exports = followController;