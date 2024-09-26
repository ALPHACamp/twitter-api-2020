const { User, Tweet } = require('../models')
const jwt = require("jsonwebtoken");

const adminController = {
  login: (req, res, next) => {
    const errData = req.user.data;
    try {
      if (!errData) {
        const userData = req.user.toJSON();
        delete userData.password;
        const token = jwt.sign(userData, process.env.JWT_SECRET, {
          expiresIn: "30d",
        }); // 簽發 JWT，效期為 30 天
        res.json({
          status: "success",
          data: {
            token,
            user: userData,
          },
        });
      } else {
        res.json(errData);
      }
    } catch (err) {
      next(err);
    }
  },

  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true,
      nest: true,
    })
      .then((users) => {
        return res.json({ status: "success", users });
      })
      .catch((err) => next(err));
  },

  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        if (!tweet) throw new Error("Tweet didn't exist!");
        return tweet.destroy();
      })
      .then((deleteTweet) => res.json({ status: "success", deleteTweet }))
      .catch((err) => next(err));
  },
};

module.exports = adminController;
