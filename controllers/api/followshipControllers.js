const db = require('../../models');
const Followship = db.Followship;

let followshipController = {
  //回傳"使用者跟隨"的人數,ID
  getFollowing: (req, res) => {
    return Followship.findAndCountAll({
      raw: true,
      nest: true,
      where: {
        followerId: req.user.id,
      },
    }).then((results) => {
      //result.count  //result.rows
      res.json({ results: results, status: 'success', message: '123' });
    });
  },
  //回傳"跟隨使用者"的人數,ID
  getFollower: (req, res) => {
    return Followship.findAndCountAll({
      raw: true,
      nest: true,
      where: {
        followingId: req.user.id,
      },
    }).then((results) => {
      //result.count  //result.rows
      res.json({ results: results, status: 'success', message: '123' });
    });
  },
  postFollowship: (req, res) => {
    return Followship.create({
      followerId: req.user.id, //1, //使用者本人
      followingId: req.params.followingId, //2, //想要追蹤的人
    }).then((followship) => {
      // console.log(followship.followerId, followship.followingId);
      res.json({ followship: followship, status: 'success', message: 'followship was successfully created' });
    });
  },
  deleteFollowship: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id, //1,
        followingId: req.params.followingId,
      },
    }).then((followship) => {
      followship.destroy().then((followship) => {
        res.json({ status: 'success', message: 'followship was successfully deleted' });
      });
    });
  },
};
module.exports = followshipController;
