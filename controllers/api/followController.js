const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const db = require('../../models')
const Followship = db.Followship
const User = db.User
const helpers = require('../../_helpers');


const followController = {
  getFollowships: (req, res) => {
    return Promise.all([
      // 此人跟隨誰, followings
      Followship.findAll({
        include: [
          { model: User, as: 'followings' }
        ],
        where: { followerId: req.params.id }
        // where: { followerId: req.dataset.id }
      }),
      // 此人的跟隨者, followers
      Followship.findAll({
        include: [
          { model: User, as: 'followers' }
        ],
        where: { followingId: req.params.id }
        // where: { followingId: req.dataset.id }
      })
    ]).then(([followings, followers]) => {
      return res.json({ followings: followings, followers: followers })
    })
  }
}

module.exports = followController
