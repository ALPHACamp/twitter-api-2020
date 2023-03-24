const { User, Followship } = require('../models');
const { getUser } = require('../_helpers');

const followshipController = {
  addFollowship: async (req, res, next) => {
    try {
      // current user's id
      const followerId = getUser(req).id;
      // add following user
      const followingId = req.body.id;

      if (followerId === Number(followingId)) {
        throw new Error('You cannot follow yourself');
      }

      const user = await User.findByPk(followingId);
      if (!user) throw new Error(`The user does't exist!!`);

      const [isFollowedUser, created] = await Followship.findOrCreate({
        where: { followerId, followingId },
      });
      // note followingId要是存在的話則會回傳false，第一個是

      if (!created) {
        throw new Error('You are already following this user');
      }

      res.status(200).json({
        message: `Your following is successfully`,
        isFollowedUser,
      });
    } catch (err) {
      next(err);
    }
  },
  removeFollowship: async (req, res, next) => {
    try {
      const followerId = getUser(req).id;
      const { followingId } = req.params;

      if (followerId === Number(followingId)) {
        throw new Error('You cannot follow yourself');
      }

      const user = await User.findByPk(followingId);
      if (!user) throw new Error(`The user does't exist!!`);

      const isFollowedUser = await Followship.destroy({
        where: { followerId, followingId },
      });
      if (!isFollowedUser) throw new Error('You are not following this user');

      const modifiedUser = user.toJSON();
      delete modifiedUser.password;
      delete modifiedUser.email;

      res.status(200).json({
        message: `You remove this user's following successfully`,
        removedFollowingUser: modifiedUser,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = followshipController;
