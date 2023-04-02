const { User, Tweet, sequelize } = require('../models');

const adminController = {
  // get all users data
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: [
          'id',
          'account',
          'name',
          'avatar',
          'coverImage',
          'role',
          [
            sequelize.literal(
              '(SELECT COUNT(follower_id) FROM Followships WHERE following_id = User.id)'
            ),
            'FollowersCount',
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(following_id) FROM Followships WHERE follower_id = User.id)'
            ),
            'FollowingsCount',
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(User_id) FROM Likes WHERE User_id = User.id)'
            ),
            'LikesCount',
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(User_id) FROM Tweets WHERE User_id = User.id)'
            ),
            'TweetsCount',
          ],
        ],
        include: [
          {
            model: Tweet,
            as: 'Tweets',
            attributes: ['User_id', 'description', 'created_at'],
            order: [
              ['User_id', 'ASC'],
              ['created_at', 'DESC'],
            ],
          },
        ],
        raw: true,
        nest: true,
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
