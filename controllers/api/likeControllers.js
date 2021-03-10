const db = require('../../models');
const helpers = require('../../_helpers');
const Like = db.Like;

let likeController = {
  Like: (req, res) => {
    const user = helpers.getUser(req);
    return Like.create({
      UserId: user.id,
      TweetId: req.params.id,
    }).then((like) => {
      res.json({ status: 'success', message: 'Like was successfully created' });
    });
  },
  UnLike: (req, res) => {
    const user = helpers.getUser(req);
    return Like.findOne({
      where: {
        UserId: user.id,
        TweetId: req.params.id,
      },
    }).then((Like) => {
      Like.destroy().then((like) => {
        res.json({ status: 'success', message: 'Like was successfully deleted' });
      });
    });
  },
};
module.exports = likeController;
