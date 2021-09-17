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
        attributes: ['followerId', 'followingId'],
        include: [
          { model: User, as: 'followings', attributes: ['name', 'account', 'avatar', 'introduction'] }
        ],
        where: { followerId: req.params.id }
        // where: { followerId: req.dataset.id }
      }),
      // 頁面主的跟隨者, followers
      Followship.findAll({
        attributes: ['followerId', 'followingId'],
        include: [
          { model: User, as: 'followers', attributes: ['name', 'account', 'avatar', 'introduction'] }
        ],
        where: { followingId: req.params.id }
        // where: { followingId: req.dataset.id }
      }),
      // 使用者跟隨誰, followings
      Followship.findAll({
        attributes: ['followerId', 'followingId'],
        where: { followerId: 5 }
        // where: { followerId: helpers.getUser(req).id }
      }),
    ]).then(([followings, followers, userFollowings]) => {
      return res.json({ followings: followings, followers: followers, userFollowings: userFollowings })
    })
  },
  follow: (req, res) => {
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.dataset.id
    }).then(followship => {
      return res.json({ status: 'success', message: `User ID ${req.dataset.id} was followed.` })
    })
  },
  unfollow: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.dataset.id
      }
    }).then(followship => {
      followship.destroy()
        .then(followship => {
          return res.json({ status: 'success', message: `User ID ${req.dataset.id} was unfollowed.` })
        })
    })
  },
}

module.exports = followController
