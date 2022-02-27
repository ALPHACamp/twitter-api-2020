const { User, Tweet, Like } = require('../models')
const jwt = require("jsonwebtoken");

const adminController = {
  login: (req, res, next) => {
    const errData = req.user.data;
    try {
      if (!errData) {
        const userData = req.user.toJSON();
        if (userData.role === 'admin') {
          delete userData.password;
          const token = jwt.sign(userData, process.env.JWT_SECRET, {
            expiresIn: "30d",
          }); // 簽發 JWT，效期為 30 天
          res.json({
            status: "success",
            data: {
              token,
              user: userData,
            }
          });
        } else { res.json({ status: "error", message: "You are not admin!"}) }
      } else {
        res.json(errData);
      }
    } catch (err) {
      next(err);
    }
  },

  getUsers: async (req, res, next) => {
    return User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        { model: Tweet, attributes: ['id'], include: { model: Like, attributes: ['id'] } },
        { model: User, as: 'Followings', attributes: ['id'] },
        { model: User, as: 'Followers', attributes: ['id'] }
      ]
    })
      .then(users => {
        const result = users
          .map(u => ({
            ...u.toJSON()
          }))

        result.forEach(r => {
          r.TweetsCount = r.Tweets.length
          r.FollowingsCount = r.Followings.length
          r.FollowersCount = r.Followers.length
          r.TweetsLikedCount = r.Tweets.reduce((acc, tweet) => acc + tweet.Likes.length, 0)
          delete r.Tweets
          delete r.Followings
          delete r.Followers
        })

        result.sort((a, b) => b.TweetsCount - a.TweetsCount)

        return res.json(result)
      })
      .catch(err => next(err))
  },

  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        if (!tweet) return res.json({ status: 'error', message: "Tweet didn't exist!" })
        return tweet.destroy();
      })
      .then((deleteTweet) => res.json({ status: "success", deleteTweet }))
      .catch((err) => next(err));
  },
};

module.exports = adminController;
