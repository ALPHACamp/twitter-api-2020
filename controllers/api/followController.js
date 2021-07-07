const db = require('../../models')
const Followship = db.Followship
const User = db.User

let followController = {
  getUserFollowers: (req, res) => {
    const options = {
      where: { followingId: req.params.id },
      include: {
        model: User,
        as: "follower",
        attributes: ['id', 'account', 'name', 'avatar']
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