const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const db = require('../../models')
const Followship = db.Followship
const User = db.User
const helpers = require('../../_helpers');


const followController = {
  getFollowships: (req, res) => {
    return Promise.all([
      // 頁面主跟隨誰, followings
      Followship.findAll({
        include: [
          { model: User, as: 'followings' }
        ],
        where: { followerId: req.params.id }
        // where: { followerId: req.dataset.id }
      }),
      // 頁面主的跟隨者, followers
      Followship.findAll({
        include: [
          { model: User, as: 'followers' }
        ],
        where: { followingId: req.params.id }
        // where: { followingId: req.dataset.id }
      }),
      // 使用者跟隨誰, followings
      Followship.findAll({
        include: [
          { model: User, as: 'userFollowings' }
        ],
        where: { followerId: 5 }
        // where: { followerId: helpers.getUser(req).id }
      }),
    ]).then(([followings, followers, userFollowings]) => {
      return res.json({ followings: followings, followers: followers, userFollowings: userFollowings })
    })
  }
}

module.exports = followController
