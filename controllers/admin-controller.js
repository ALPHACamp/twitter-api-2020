const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, Tweet, sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

const adminController = {
  signIn: async (req, res, next) => {
    const { account, password } = req.body;
    try {
      if (!account || !password) {
        const error = new Error("欄位不可空白!");
        error.status = 400;
        throw error;
      }
      const foundUser = await User.findOne({ where: { account } });
      if (!foundUser || !foundUser.isAdmin) {
        const error = new Error("帳號不存在!");
        error.status = 404;
        throw error;
      }
      const isMatch = await bcrypt.compare(password, foundUser.password);
      if (!isMatch) {
        const error = new Error("密碼不正確!");
        error.status = 400;
        throw error;
      }
      const loginUser = foundUser.toJSON();
      delete loginUser.password;
      const token = jwt.sign(loginUser, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      return res.json({
        token,
        ...loginUser,
      });
    } catch (error) {
      return next(error);
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await sequelize.query(
        `
      SELECT u.*, userTweet.tweetCounts, userFollower.followerCounts, userFollowing.followingCounts, userTweetLike.userTweetLikeCounts
      FROM Users as u LEFT OUTER JOIN (
        SELECT u.id as UserId, count(u.id) as tweetCounts
        FROM Users as u INNER JOIN Tweets as t
        on u.id = t.UserId
        GROUP BY u.id
      ) as userTweet
      on u.id = userTweet.UserId
      LEFT OUTER JOIN (
        SELECT f.followingId, count(followingId) as followerCounts
        FROM Followships as f
        GROUP BY f.followingId
      ) as userFollower
      on u.id = userFollower.followingId
      LEFT OUTER JOIN (
        SELECT f.followerId, count(followerId) as followingCounts
        FROM Followships as f
        GROUP BY f.followerId
      ) as userFollowing
      on u.id = userFollowing.followerId
      LEFT OUTER JOIN (
        SELECT t.UserId as TweetOwner , count(t.UserId) as userTweetLikeCounts
        FROM Likes as l INNER JOIN Tweets as t
        on l.TweetId = t.id
        GROUP BY t.UserId
      ) as userTweetLike
      on u.id = userTweetLike.TweetOwner
      ORDER BY tweetCounts DESC
      `,
        { type: QueryTypes.SELECT }
      );
      const data = users.map((u) => {
        delete u.password;
        return {
          ...u,
          isAdmin: u.role === "admin",
          tweetCounts: u.tweetCounts || 0,
          followerCounts: u.followerCounts || 0,
          followingCounts: u.followingCounts || 0,
          userTweetLikeCounts: u.userTweetLikeCounts || 0
        };
      });
      return res.json(data);
    } catch (error) {
      return next(error);
    }
  },
  deleteTweet: async (req, res, next) => {
    const { id } = req.params;
    try {
      const deletedCount = await Tweet.destroy({ where: { id } });
      return res.json({ message: `刪除了 ${deletedCount} 筆資料` });
    } catch (error) {
      return next(error);
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        nest: true,
        raw: true,
        include: [
          {
            model: User,
            attributes: ["id", "account", "name", "avatar"],
          },
        ],
        attributes: [
          "id",
          "description",
          "createdAt",
          // 計算每筆Tweet有幾個replies
          [
            sequelize.literal(
              "(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)"
            ),
            "replyCounts",
          ],
          // 計算每筆Tweet有幾個likes
          [
            sequelize.literal(
              "(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)"
            ),
            "likeCounts",
          ],
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.json(tweets);
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = adminController;
