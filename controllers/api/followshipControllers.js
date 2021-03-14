const db = require('../../models');
const helpers = require('../../_helpers');
const Followship = db.Followship;

let followshipController = {
  postFollowship: (req, res) => {
    const user = helpers.getUser(req);
    const followingId = req.body.id;
    Followship.findOne({
      where: { followerId: user.id, followingId: followingId },
    }).then((followship) => {
      if (followship) {
        return res.json({ status: 'error', message: '已跟隨' });
      } else {
        return Followship.create({
          followerId: user.id, //使用者本人
          followingId: followingId, //想要追蹤的人
        }).then((followship) => {
          res.json({ followship: followship, status: 'success', message: 'followship was successfully created' });
        });
      }
    });
  },
  deleteFollowship: (req, res) => {
    const user = helpers.getUser(req);
    return Followship.findOne({
      where: {
        followerId: user.id, //req.user.id
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
