const db = require('../../models');
const Like = db.Like;

let likeController = {
  Like: (req, res) => {
    return Like.create({
      UserId: req.user.id, //1, //使用者本人
      TweetId: req.params.followingId, //2, //想要追蹤的人
    }).then((like) => {
      res.json({ Like: Like, status: 'success', message: 'Like was successfully created' });
    });
  },
  UnLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id, //1,
        TweetId: req.params.followingId,
      },
    }).then((Like) => {
      Like.destroy().then((like) => {
        res.json({ status: 'success', message: 'Like was successfully deleted' });
      });
    });
  },
};
module.exports = LikeController;
