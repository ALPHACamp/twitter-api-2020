const { QueryTypes } = require('sequelize');
const { sequelize } = require('sequelize');
const db = require('../models');
const { User, Tweet, Like, Reply } = require('../models');

const adminController = {
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
      //   const tweet = await Tweet.findOne({
      //     where: { id },
      //   });
      //   if (!tweet) throw new Error('Tweet id not found!');

      //   const de = await db.sequelize.query(
      //     `DELETE Tweets, Likes, Replies FROM Tweets JOIN Likes JOIN Replies WHERE Likes.Tweet_id = Tweets.id AND Replies.Tweet_id = Tweets.id AND Tweets.id = ${id};`,
      //     {
      //       type: db.sequelize.QueryTypes.DELETE,
      //     }
      //   );
      return res.status(200).json({ message: '刪除成功' });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = adminController;
