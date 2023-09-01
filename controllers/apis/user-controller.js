const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
const { imgurFileHandler } = require("../../helpers/file-helpers");

const db = require("../../models");
const helpers = require("../../_helpers");

const { User, Tweet, Reply, Followship, Like } = db;
const { Op } = require("sequelize");
const like = require("../../models/like");

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body;

      if (!account || !email || !password || !checkPassword) {
        throw new Error(
          "Please enter account, email, password and checkPassword"
        );
      }

      // 檢查帳號是否重複
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email }, { account }],
        },
      });

      if (user) {
        if (user.account === account) throw new Error("account 已重複註冊！");
        if (user.email === email) throw new Error("email 已重複註冊！");
      }

      const createdUser = await User.create({
        name: name || account,
        email,
        account,
        password: bcrypt.hashSync(password, 10),
        avatar: `https://picsum.photos/100/100/cat/?random=${
          Math.random() * 100
        }`,
        cover: "https://picsum.photos/id/237/700/400",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res.status(200).json({
        status: "success",
        message: "Successfully create user.",
        data: createdUser,
      });
    } catch (err) {
      next(err);
    }
  },
  signIn: async (req, res, next) => {
    try {
      const { account, password } = req.body;
      if (!account || !password) {
        throw new Error("Please enter account and password");
      }

      const user = await User.findOne({ where: { account } });
      if (!user) throw new Error("User does not exist");
      if (user.role === "admin") throw new Error("admin permission denied");
      if (!bcrypt.compareSync(password, user.password)) {
        throw new Error("Incorrect password");
      }
      const payload = {
        id: user.id,
        account: user.account,
        role: user.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      const userId = user.toJSON().id;

      res.status(200).json({
        status: "success",
        data: {
          token,
          userId,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  getUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const currentUserId = helpers.getUser(req).id;

      const [user, tweetCount, followerCount, followingCount] =
        await Promise.all([
          User.findByPk(id, { raw: true, nest: true }),
          Tweet.count({
            where: { UserId: id },
          }),
          Followship.count({
            where: { followerId: id },
          }),
          Followship.count({
            where: { followingId: id },
          }),
        ]);

      if (!user) {
        return res
          .status(401)
          .json({ status: "error", message: "This user does not exist" });
      }

      delete user.password;
      user.tweetCount = tweetCount;
      user.followerCount = followerCount;
      user.followingCount = followingCount;

      if (Number(id) !== currentUserId) {
        const checkUserFollowing = await Followship.findAll({
          where: { followerId: currentUserId },
          raw: true,
        });
        user.isFollowed = checkUserFollowing.some(
          (follow) => follow.followingId === Number(id)
        );
      }
      console.log(user);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },
  getUserRepliedTweets: async (req, res, next) => {
    try {
      const userId = req.params.id;

      const [user, replies] = await Promise.all([
        User.findByPk(userId, { raw: true, nest: true }),
        Reply.findAll({
          where: { UserId: userId },
          include: [
            {
              model: User,
              as: "replier",
              attributes: { exclude: ["password"] },
            },
            {
              model: Tweet,
              as: "tweetreply",
              include: [
                {
                  model: User,
                  as: "author",
                  attributes: ["account", "name"],
                  // where: { role: "user" },
                },
              ],
            },
          ],
          order: [["createdAt", "DESC"]],
          nest: true,
        }),
        Like.findAll({
          where: { userId },
        }),
      ]);

      const userRepliesResult = replies.map((reply) => ({
        replyId: reply.id,
        comment: reply.comment,
        replierId: reply.replier.id,
        replierName: reply.replier.name,
        replierAvatar: reply.replier.avatar,
        replierAccount: reply.replier.account,
        createdAt: reply.createdAt,
        tweetId: reply.TweetId,
        tweetBelongerName: reply.tweetreply.author.name,
        tweetBelongerAccount: reply.tweetreply.author.account,
      }));

      res.status(200).json(userRepliesResult);
    } catch (err) {
      next(err);
    }
  },
  updateUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { account, name, email, password, introduction } = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "This user does not exist",
        });
      }

      const currentUserId = helpers.getUser(req).id;

      if (!currentUserId) {
        throw new Error("Current user ID is missing");
      }

      if (currentUserId !== Number(id)) {
        throw new Error("Cannot edit other users profile");
      }

      if (name && name.length > 50) {
        throw new Error("the length of name should less than 50 characters");
      }
      if (introduction && introduction.length > 160) {
        throw new Error(
          "the length of introduction should less than 160 characters"
        );
      }

      if (account) {
        const userByAccount = await User.findOne({
          where: { account },
          raw: true,
          nest: true,
        });

        if (userByAccount && userByAccount.account === account) {
          throw new Error("account 已重複註冊!");
        }
      }

      if (email) {
        const userByEmail = await User.findOne({ where: { email } });
        if (userByEmail && userByEmail.email === email) {
          throw new Error("email 已重複註冊!");
        }
      }

      const { files } = req;

      let newAvatar = "";
      let newCover = "";

      if (files && files.avatar && files.avatar[0].fieldname === "avatar") {
        newAvatar = await imgurFileHandler(files.avatar[0]);
      }
      if (files && files.cover && files.cover[0].fieldname === "cover") {
        newCover = await imgurFileHandler(files.cover[0]);
      }

      await user.update({
        name: name || user.name,
        email: email || user.email,
        account: account || user.account,
        password: password ? bcrypt.hashSync(password, 10) : user.password,
        introduction: introduction || user.introduction,
        avatar: newAvatar || user.avatar,
        cover: newCover || user.cover,
      });
      res.status(200).json({
        status: "success",
        message: "Successfully update user.",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
  getUserLikes: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id;
      const { id } = req.params;
      const user = await User.findByPk(id, { raw: true, nest: true });
      if (!user) throw new Error("User does not exist");
      const likes = await Like.findAll({
        where: { userId: id },
        raw: true,
        nest: true,
        include: [
          // {
          //   model: User,
          //   attributes: { exclude: ["password"] },
          // },
          {
            model: Tweet,
            as: "likedTweet",
            attributes: [
              "id",
              "UserId",
              "description",
              "createdAt",
              "updatedAt",
              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT id) FROM Replies WHERE tweet_id = likedTweet.id)"
                ),
                "replyCount",
              ],
              [
                sequelize.literal(
                  "(SELECT COUNT(DISTINCT id) FROM Likes WHERE tweet_id = likedTweet.id)"
                ),
                "likeCount",
              ],
              [
                sequelize.literal(
                  `(CASE WHEN EXISTS (SELECT 1 FROM Likes WHERE tweet_id = likedTweet.id AND user_id = ${currentUserId}) THEN TRUE ELSE FALSE END)`
                ),
                "isLiked",
              ],
            ],
            include: [
              { model: User, as: "author" },
              // { model: Reply, as: "replies" },
            ],
          },
        ],
      });
      console.log(likes);

      if (likes.length === 0) {
        return res.status(200).json({ status: "success", message: "No likes" });
      }

      const likedTweetsData = likes.map((like) => ({
        TweetId: like.likedTweet.id,
        tweetBelongerName: like.likedTweet.author.name,
        tweetBelongerAccount: like.likedTweet.author.account,
        tweetBelongerAvatar: like.likedTweet.author.avatar,
        tweetContent: like.likedTweet.description,
        createdAt: like.likedTweet.createdAt,
        replyCount: like.likedTweet.replyCount,
        likeCount: like.likedTweet.likeCount,
        isLiked: like.likedTweet.isLiked === 1,
      }));
      res.status(200).json(likedTweetsData);
    } catch (err) {
      next(err);
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, { raw: true, nest: true });
      if (!user) throw new Error("User does not exist");
      const [userTweets] = await Promise.all([
        Tweet.findAll({
          where: { userId: id },
          order: [["createdAt", "DESC"]],
          attributes: [
            "id",
            "description",
            "createdAt",
            "updatedAt",
            [
              sequelize.literal(`(
            SELECT COUNT(*)
            FROM Likes
            WHERE Likes.tweet_id = Tweet.id
          )`),
              "likeCount",
            ],
            [
              sequelize.literal(`(
            SELECT COUNT(*)
            FROM Replies
            WHERE Replies.tweet_id = Tweet.id
          )`),
              "replyCount",
            ],
          ],
          include: [
            {
              model: User,
              as: "author",
              attributes: { exclude: ["password"] },
            },
          ],
        }),
      ]);
      console.log(userTweets);
      const userTweetsData = userTweets.map((tweet) => ({
        TweetId: tweet.id,
        tweetBelongerName: tweet.author.name,
        tweetBelongerAccount: tweet.author.account,
        tweetBelongerAvatar: tweet.author.avatar,
        description: tweet.description,
        createdAt: tweet.createdAt,
        replyCount: tweet.replyCount,
        likeCount: tweet.likeCount,
      }));

      res.status(200).json(userTweetsData);
    } catch (err) {
      next(err);
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const { id } = req.params; // 18 target
      const user = await User.findByPk(id, {
        include: {
          model: User,
          as: "Followers",
        },
      });

      if (!user) throw new Error("User does not exist");
      if (!user.Followers) {
        return res
          .status(200)
          .json({ status: "success", message: "No followers" });
      }

      const currentUserId = helpers.getUser(req).id;

      const currentUserFollowingId = await Followship.findAll({
        where: { followerId: currentUserId },
        raw: true,
      });

      const followingIds = currentUserFollowingId.map(
        (item) => item.followingId
      );

      const followersData = user.Followers.map((follower) => ({
        followerId: follower.id,
        followerAccount: follower.account,
        followerName: follower.name,
        followerAvatar: follower.avatar,
        isFollowed: followingIds.includes(follower.id),
        follower,
      }));

      res.status(200).json(followersData);
    } catch (err) {
      next(err);
    }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        include: {
          model: User,
          as: "Followings",
        },
      });
      if (!user) throw new Error("User does not exist");
      if (!user.Followings) {
        return res
          .status(200)
          .json({ status: "success", message: "No followings" });
      }

      const currentUserId = helpers.getUser(req).id;

      const currentUserFollowingId = await Followship.findAll({
        where: { followerId: currentUserId },
        raw: true,
      });

      const followingIds = currentUserFollowingId.map(
        (item) => item.followingId
      );

      const followingsData = user.Followings.map((following) => ({
        followingId: following.id,
        followingAccount: following.account,
        followingName: following.name,
        followingAvatar: following.avatar,
        isFollowed: followingIds.includes(following.id),
        following,
      }));

      res.status(200).json(followingsData);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
