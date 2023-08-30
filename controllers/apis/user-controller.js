const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
const { imgurFileHandler } = require("../../helpers/file-helpers");

const db = require("../../models");
const helpers = require("../../_helpers");

const { User, Tweet, Reply, Followship, Like } = db;
const { Op } = require("sequelize");

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body;

      if (!account || !name || !email || !password || !checkPassword) {
        throw new Error("all the blanks are required");
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
        name,
        email,
        account,
        password: bcrypt.hashSync(password, 10),
        avatar: "https://picsum.photos/100/100",
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
  getUserReplies: async (req, res, next) => {
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
                { model: User, as: "author", attributes: ["account", "name"] },
              ],
            },
          ],
          order: [["createdAt", "DESC"]],
          nest: true,
        }),
      ]);

      const userRepliesResult = replies.map((reply) => ({
        replyId: reply.id,
        comment: reply.comment,
        replierId: user.id,
        replierName: user.name,
        replierAvatar: user.avatar,
        replierAccount: user.account,
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
      const { id } = req.params;
      const user = await User.findByPk(id, { raw: true, nest: true });
      if (!user) throw new Error("User does not exist");

      // const likeTweets = await Like.findAll({
      //   where: { userId: id },
      //   order: [["createdAt", "DESC"]],
      //   include: [
      //     {
      //       model: Tweet,
      //       as: "likedTweet",
      //       raw: true,
      //       nest: true,
      //       attributes: { exclude: ["password"] },
      //       include: [
      //         {
      //           model: User,
      //           as: "author",
      //           attributes: ["account", "name", "avatar"],
      //         },
      //         {
      //           model: Like,
      //         },
      //         {
      //           model: Reply,
      //           as: "replies",
      //         },
      //       ],
      //     },
      //   ],
      // });
      const likedTweets = await Tweet.findAll({
        where: { userId: id },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            as: "author",
            attributes: { exclude: ["password"] },
          },
          {
            model: Like,
          },
          {
            model: Reply,
            as: "replies",
          },
        ],
      });
      if (likedTweets.length === 0) {
        throw new Error("the user did not like any tweet");
      }
      console.log(likedTweets);
      // const likedTweetsData = likeTweets.map((tweet) => ({
      //   TweetId: tweet.likedTweet.id,
      //   tweetBelongerName: tweet.likedTweet.author.name,
      //   tweetBelongerAccount: tweet.likedTweet.author.account,
      //   tweetBelongerAvatar: tweet.likedTweet.author.avatar,
      //   tweetContent: tweet.likedTweet.description,
      //   createdAt: tweet.createdAt,
      //   replyCount: tweet.likedTweet.Likes.length,
      //   likeCount: tweet.likedTweet.replies.length,
      // }));
      res.status(200).json(likedTweets);
    } catch (err) {
      next(err);
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, { raw: true, nest: true });
      if (!user) throw new Error("User does not exist");

      const userTweets = await Tweet.findAll({
        where: { userId: id },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            as: "author",
            attributes: { exclude: ["password"] },
          },
          {
            model: Like,
          },
          {
            model: Reply,
            as: "replies",
          },
        ],
      });
      console.log(userTweets);
      const userTweetsData = userTweets.map((tweet) => ({
        TweetId: tweet.id,
        tweetBelongerName: tweet.author.name,
        tweetBelongerAccount: tweet.author.account,
        tweetBelongerAvatar: tweet.author.avatar,
        description: tweet.description,
        createdAt: tweet.createdAt,
        replyCount: tweet.Likes.length,
        likeCount: tweet.replies.length,
      }));

      res.status(200).json(userTweetsData);
    } catch (err) {
      next(err);
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, { raw: true, nest: true });
      if (!user) throw new Error("User does not exist");

      const currentUserId = helpers.getUser(req).id;

      const followers = await Followship.findAll({
        where: { followingId: id },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            as: "follower",
            attributes: { exclude: ["password"] },
          },
        ],
        attributes: [
          "followerId",
          "followingId",
          "createdAt",
          "updatedAt",
          [
            sequelize.literal(
              `(CASE WHEN EXISTS (SELECT 1 FROM Followships WHERE follower_id = ${currentUserId} AND following_id = ${id}) THEN TRUE ELSE FALSE END)`
            ),
            "isFollowed",
          ],
        ],
        raw: true,
        nest: true,
      });
      const followersData = followers.map((item) => ({
        ...item,
        isFollowed: item.isFollowed === 1,
      }));

      res.status(200).json(followersData);
    } catch (err) {
      next(err);
    }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, { raw: true, nest: true });
      if (!user) throw new Error("User does not exist");
      const currentUserId = helpers.getUser(req).id;

      const following = await Followship.findAll({
        where: { followerId: id },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            as: "following",
            attributes: { exclude: ["password"] },
          },
        ],
        attributes: [
          "followerId",
          "followingId",
          "createdAt",
          "updatedAt",
          [
            sequelize.literal(
              `(CASE WHEN EXISTS (SELECT 1 FROM Followships WHERE follower_id = ${currentUserId} AND following_id = ${id}) THEN TRUE ELSE FALSE END)`
            ),
            "isFollowed",
          ],
        ],
        raw: true,
        nest: true,
      });

      const followings = following.map((item) => ({
        ...item,
        isFollowed: item.isFollowed === 1,
      }));
      console.log(followings);
      res.status(200).json(followings);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
