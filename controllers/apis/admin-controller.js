const bcrypt = require("bcryptjs");
const db = require("../../models");
const { User, Tweet, Like } = db;
const jwt = require("jsonwebtoken");

const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const options = {
        raw: true,
        attributes: {
          exclude: ["email", "password", "updatedAt", "createdAt"],
        },
      };
      const users = await User.findAll(options);
      // console.log("usersbeforeforeach", users);
      users.forEach((user) => {
        if (user.introduction) {
          user.introduction = user.introduction.substring(0, 50);
        }
      });

      // console.log(users);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const options = {
        raw: true,
        nest: true,
        attributes: [
          "id",
          "description",
          "replyCount",
          "likeCount",
          "createdAt",
        ],
        include: [
          {
            model: User,
            attributes: ["id", "account", "name", "avatar"],
            as: "author",
          },
        ],
      };
      const tweets = await Tweet.findAll(options);
      tweets.forEach((tweet) => {
        tweet.description = tweet.description.substring(0, 50);
      });
      res.status(200).json(tweets);
    } catch (err) {
      next(err);
    }
  },

  deleteTweet: async (req, res) => {
    try {
      const [tweet] = await Promise.all([
        Tweet.destroy({
          where: { id: req.params.id },
          raw: true,
          nest: true,
        }),
        Like.destroy({
          where: { TweetId: req.params.id },
          raw: true,
          nest: true,
        }),
      ]);

      if (!tweet) {
        throw new Error(
          "此貼文不存在，可能是 Parameters 的資料錯誤或已經被刪除"
        );
      }

      return res.status(200).json({
        status: "success",
        message: "Successfully delete tweet.",
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  signIn: async (req, res, next) => {
    try {
      const { account, password } = req.body;
      if (!account || !password) {
        throw new Error("Please enter account and password");
      }

      const userData = await User.findOne({ where: { account } });

      if (!userData) throw new Error("User does not exist");
      if (userData.role === "user") throw new Error("user permission denied");
      if (!bcrypt.compareSync(password, userData.password)) {
        throw new Error("Incorrect password");
      }

      const payload = {
        id: userData.id,
        account: userData.account,
        role: userData.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      return res.status(200).json({
        status: "success",
        data: {
          token,
          user: userData,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = adminController;
