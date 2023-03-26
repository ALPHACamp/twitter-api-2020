const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await sequelize.query(
        `
      SELECT u.*, userTweet.tweetCount, userFollower.followerCount, userFollowing.followingCount, userTweetLike.userTweetLikeCount
      FROM users as u LEFT OUTER JOIN (
        SELECT u.id as UserId, count(u.id) as tweetCount 
        FROM users as u INNER JOIN tweets as t
        on u.id = t.UserId
        GROUP BY u.id
      ) as userTweet
      on u.id = userTweet.UserId
      LEFT OUTER JOIN (
        SELECT f.followingId, count(followingId) as followerCount
        FROM followships as f
        GROUP BY f.followingId
      ) as userFollower
      on u.id = userFollower.followingId
      LEFT OUTER JOIN (
        SELECT f.followerId, count(followerId) as followingCount
        FROM followships as f
        GROUP BY f.followerId
      ) as userFollowing
      on u.id = userFollowing.followerId
      LEFT OUTER JOIN (
        SELECT t.UserId as TweetOwner , count(t.UserId) as userTweetLikeCount
        FROM likes as l INNER JOIN tweets as t
        on l.TweetId = t.id
        GROUP BY t.UserId
      ) as userTweetLike
      on u.id = userTweetLike.TweetOwner
      ORDER BY tweetCount DESC
      `,
        { type: QueryTypes.SELECT }
      );
      const data = users.map(u => {
        delete u.password
        return {
          ...u,
          isAdmin: u.role === 'admin'
        }
      })
      return res.json(data);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = adminController;
