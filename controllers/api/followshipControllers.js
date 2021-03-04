const db = require('../../models');
const Followship = db.Followship;

let followshipController = {
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
