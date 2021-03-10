const bcrypt = require('bcryptjs');
const helpers = require('../../_helpers');
const { User, Tweet, Reply, Like, Followship } = require('../../models');
const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');

let adminController = {
  signIn: (req, res) => {
    if (!req.body.account || !req.body.password) {
      return res.json({ status: 'error', message: '請填寫完整資料' });
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ where: { email } })
      .then((user) => {
        if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' });

        if (user.role !== 'admin') {
          return res.status(401).json({ status: 'error', message: 'Permission denied.' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ status: 'error', message: 'passwords did not match' });
        }

        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        return res.json({
          status: 'success',
          message: 'ok',
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            account: user.account,
            role: user.role,
          },
        });
      })
      .catch((error) => res.send(error));
  },

  getUsers: (req, res) => {
    User.findAll({
      where: { role: 'user' },
      //跟隨者 跟隨中 被like的文章數  發文數
      raw: true,
      nest: true,
      attributes: [
        'id',
        'name',
        'account',
        'avatar',
        'cover',
        [
          sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'),
          'FollowerCount',
        ],
        [
          sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'),
          'FollowingCount',
        ],
        [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'TweetCount'],
        // //找出使用者的所有tweet 並計算每個tweet有幾個userId
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId IN (SELECT id FROM Tweets WHERE Tweets.UserId = User.id) )'
          ),
          'isLikedCount',
        ],
      ],
      order: [[sequelize.literal('FollowerCount'), 'DESC']],
    }).then((users) => {
      return res.json(users);
    });
  },
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [User],
      order: [['createdAt', 'DESC']],
    }).then((tweets) => {
      const data = tweets.map((t) => ({
        ...t.dataValues,
        description: t.dataValues.description.substring(0, 50),
      }));
      return res.json(data);
    });
  },

  deleteTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id);

      if (!tweet) {
        return res.json({ status: 'error', message: '此則貼文不存在!' });
      }
      await Reply.destroy({ where: { TweetId: req.params.id } });
      await Like.destroy({ where: { TweetId: req.params.id } });
      await tweet.destroy();

      res.json({ status: 'success', message: '成功刪除該則推文!' });
    } catch (error) {
      console.warn(error);
    }
  },
};

module.exports = adminController;
