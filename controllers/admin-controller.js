const { User, Tweet, Like } = require('../models');

const adminController = {
  // get all users data
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'account', 'name', 'avatar', 'coverImage', 'role'],
        raw: true,
        nest: true,
        include: [
          {
            model: User,
            as: 'Followers',
            attributes: ['id', 'account', 'name'],
          },
          { model: User, as: 'Followings' },
          { model: Tweet },
          { model: Like },
        ],
      });

      return res.status(200).json(users);
    } catch (err) {
      return next(err);
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw new Error('Tweet id is required!');

      const deleteTweet = await Tweet.destroy({
        where: { id },
      });
      if (!deleteTweet) throw new Error('Tweet id not found!');
      return res.status(200).json({ message: '刪除成功' });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = adminController;
