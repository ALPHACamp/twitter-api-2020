const db = require("../../models");
const { User, Tweet, Like, Followship } = db;
const helpers = require("../../_helpers");

const followshipController = {
  followUser: async (req, res, next) => {
    try {
      const followedUserId = req.body.id;
      const getUser = helpers.getUser(req);
      const userId = getUser.id;
      //   const [user, followship] = await Promise.all([
      //     User.findByPk(userId),
      //     Followship.findOne({ where :followerId= }),
      //   ]);
      res.json({
        status: "success",
      });
    } catch (err) {
      next(err);
    }
  },
  unfollowUser: (req, res, next) => {},
  getTop10: (req, res, next) => {},
};

module.exports = followshipController;
