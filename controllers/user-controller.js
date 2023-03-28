const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op, QueryTypes } = require("sequelize");
const imgurFileHandler = require("../helpers/file-helper");
const { getUser } = require("../helpers/auth-helper");
const {
  User,
  Tweet,
  Reply,
  Like,
  Followship,
  sequelize,
} = require("../models");

const userController = {
  signUp: async (req, res, next) => {
    const { name, account, email, password, checkPassword } = req.body;
    try {
      if (!name || !account || !email || !password || !checkPassword) {
        const error = new Error("欄位不可空白!");
        error.status = 400;
        throw error;
      }
      if (password !== checkPassword) {
        const error = new Error("密碼與確認密碼不符!");
        error.status = 400;
        throw error;
      }
      const [isEmailExist, isAccountExist] = await Promise.all([
        User.findOne({ where: { email } }),
        User.findOne({ where: { account } }),
      ]);
      if (isEmailExist) {
        const error = new Error("email 已重複註冊！");
        error.status = 400;
        throw error;
      }
      if (isAccountExist) {
        const error = new Error("account 已重複註冊！");
        error.status = 400;
        throw error;
      }
      const user = await User.create({
        name,
        account,
        email,
        password: bcrypt.hashSync(password, 10),
      });
      const newUser = user.toJSON();
      delete newUser.password;
      return res.json(newUser);
    } catch (error) {
      return next(error);
    }
  },
  signIn: async (req, res, next) => {
    const { account, password } = req.body;
    try {
      if (!account || !password) {
        const error = new Error("欄位不可空白!");
        error.status = 400;
        throw error;
      }
      const foundUser = await User.findOne({ where: { account } });
      if (!foundUser || foundUser.isAdmin) {
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
  getUser: async (req, res, next) => {
    const { id } = req.params;
    try {
      const [foundUser, loginUser] = await Promise.all([
        User.findByPk(id, {
          attributes: {
            include: [
              [
                sequelize.literal(
                  `(SELECT COUNT(*) FROM Followships WHERE followingId = ${id})`
                ),
                "followerCounts",
              ],
              [
                sequelize.literal(
                  `(SELECT COUNT(*) FROM Followships WHERE followerId = ${id})`
                ),
                "followingCounts",
              ],
            ],
          },
        }),
        User.findByPk(getUser(req).id, {
          include: [{ model: User, as: "Followings", attributes: ["id"] }],
        }),
      ]);
      const loginUserFollowingIds = loginUser?.Followings
        ? loginUser.Followings.map((f) => f.id)
        : [];
      if (!foundUser || foundUser.isAdmin) {
        const error = new Error("使用者不存在!");
        error.status = 404;
        throw error;
      }
      const user = foundUser.toJSON();
      delete user.password;
      return res.json({
        ...user,
        // - 目前登入的使用者有無追蹤查詢的使用者
        isFollowed: loginUserFollowingIds.some((fid) => fid === Number(id)),
      });
    } catch (error) {
      return next(error);
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const foundUser = await User.findByPk(getUser(req).id);
      if (!foundUser) {
        const error = new Error("使用者不存在!");
        error.status = 404;
        throw error;
      }
      const currentUser = foundUser.toJSON();
      delete currentUser.password;
      return res.json({ ...currentUser });
    } catch (error) {
      return next(error);
    }
  },
  putUser: async (req, res, next) => {
    const { id } = req.params;
    const { name, introduction } = req.body;
    // - 若有傳任一張圖片 req.files 才存在
    const avatar = req.files?.avatar;
    const cover = req.files?.cover;
    const avatarFile = avatar ? avatar[0] : null;
    const coverFile = cover ? cover[0] : null;
    try {
      if (introduction.length > 160 || name.length > 50) {
        const error = new Error("字數超出上限！");
        error.status = 400;
        throw error;
      }
      if (getUser(req).id !== Number(id)) {
        const error = new Error("無法更改他人資料!");
        error.status = 401;
        throw error;
      }
      const [foundUser, avatarLink, coverLink] = await Promise.all([
        User.findByPk(id),
        imgurFileHandler(avatarFile),
        imgurFileHandler(coverFile),
      ]);
      if (!foundUser || foundUser.isAdmin) {
        const error = new Error("使用者不存在!");
        error.status = 404;
        throw error;
      }
      const data = await foundUser.update({
        name,
        introduction,
        avatar: avatarLink || foundUser.avatar,
        cover: coverLink || foundUser.cover,
      });
      const updatedUser = data.toJSON();
      delete updatedUser.password;
      return res.json({ ...updatedUser });
    } catch (error) {
      return next(error);
    }
  },
  putUserSetting: async (req, res, next) => {
    const { id } = req.params;
    const { name, account, email, password, checkPassword } = req.body;
    try {
      if (getUser(req).id !== Number(id)) {
        const error = new Error("無法更改他人資料!");
        error.status = 401;
        throw error;
      }
      if (!name || !account || !email || !password || !checkPassword) {
        const error = new Error("欄位不可空白!");
        error.status = 400;
        throw error;
      }
      if (password !== checkPassword) {
        const error = new Error("密碼與確認密碼不符!");
        error.status = 400;
        throw error;
      }
      // - 確認更改的新值 (email, account) 是否有自己以外的人已經擁有了
      const [isEmailExist, isAccountExist] = await Promise.all([
        User.findOne({ where: { email, id: { [Op.ne]: id } } }),
        User.findOne({ where: { account, id: { [Op.ne]: id } } }),
      ]);
      if (isEmailExist) {
        const error = new Error("email 已重複註冊！");
        error.status = 400;
        throw error;
      }
      if (isAccountExist) {
        const error = new Error("account 已重複註冊！");
        error.status = 400;
        throw error;
      }
      const foundUser = await User.findByPk(id);
      if (!foundUser || foundUser.isAdmin) {
        const error = new Error("使用者不存在!");
        error.status = 404;
        throw error;
      }
      const data = await foundUser.update({
        name,
        account,
        email,
        password: bcrypt.hashSync(password, 10),
      });
      const updatedUser = data.toJSON();
      delete updatedUser.password;
      return res.json({ ...updatedUser });
    } catch (error) {
      return next(error);
    }
  },
  addFollowing: async (req, res, next) => {
    const { id } = req.body;
    try {
      if (getUser(req).id === Number(id)) {
        const error = new Error("無法追蹤自己!");
        error.status = 400;
        throw error;
      }
      const [foundUser, followship] = await Promise.all([
        User.findByPk(id, { raw: true }),
        Followship.findOne({
          where: {
            followerId: getUser(req).id,
            followingId: Number(id),
          },
        }),
      ]);
      if (followship) {
        const error = new Error("已追蹤過此使用者!");
        error.status = 400;
        throw error;
      }
      if (!foundUser || foundUser.isAdmin) {
        const error = new Error("使用者不存在!");
        error.status = 404;
        throw error;
      }
      // - 新增追蹤
      const createdFollowship = await Followship.create({
        followerId: getUser(req).id,
        followingId: Number(id),
      });
      const data = createdFollowship.toJSON();
      return res.json({ ...data });
    } catch (error) {
      return next(error);
    }
  },
  removeFollowing: async (req, res, next) => {
    const { followingId } = req.params;
    try {
      if (getUser(req).id === Number(followingId)) {
        const error = new Error("無法追蹤自己!");
        error.status = 400;
        throw error;
      }
      const foundUser = await User.findByPk(followingId, { raw: true });
      if (!foundUser || foundUser.isAdmin) {
        const error = new Error("使用者不存在!");
        error.status = 404;
        throw error;
      }
      // - 取消追蹤 (回傳刪除的資料筆數)
      const deletedCount = await Followship.destroy({
        where: {
          followerId: getUser(req).id,
          followingId: Number(followingId),
        },
      });
      return res.json({ message: `刪除了 ${deletedCount} 筆資料` });
    } catch (error) {
      return next(error);
    }
  },
  getUserTweets: async (req, res, next) => {
    const { id } = req.params;
    try {
      const foundUser = await User.findByPk(id);
      if (!foundUser || foundUser.isAdmin) {
        const error = new Error("使用者不存在!");
        error.status = 404;
        throw error;
      }
      const [tweets, loginUser] = await Promise.all([
        Tweet.findAll({
          include: [
            { model: Reply, attributes: ["id"] },
            { model: Like, attributes: ["id"] },
          ],
          attributes: ["id", "description", "UserId", "createdAt"],
          where: {
            UserId: id,
          },
          order: [["createdAt", "DESC"]],
        }),
        User.findByPk(getUser(req).id, {
          include: [{ model: Like, attributes: ["TweetId"] }],
        }),
      ]);
      const loginUserLikeTweetIds = loginUser?.Likes
        ? loginUser.Likes.map((l) => l.TweetId)
        : [];
      const data = tweets.map((t) => {
        const tweet = t.toJSON();
        const replyCounts = t.Replies.length;
        const likeCounts = t.Likes.length;
        delete tweet.Replies;
        delete tweet.Likes;
        return {
          ...tweet,
          replyCounts,
          likeCounts,
          // - 目前登入的使用者有無按過喜歡
          isLiked: loginUserLikeTweetIds.some((tid) => tid === tweet.id),
        };
      });
      return res.json(data);
    } catch (error) {
      return next(error);
    }
  },
  getUserReplies: async (req, res, next) => {
    const { id } = req.params;
    try {
      const foundUser = await User.findByPk(id);
      if (!foundUser || foundUser.isAdmin) {
        const error = new Error("使用者不存在!");
        error.status = 404;
        throw error;
      }
      const replies = await Reply.findAll({
        include: [
          {
            model: Tweet,
            attributes: ["id"],
            include: [{ model: User, attributes: ["id", "account"] }],
          },
        ],
        where: {
          UserId: id,
        },
        order: [["createdAt", "DESC"]],
      });
      const data = replies.map((r) => {
        const reply = r.toJSON();
        const replyTo = r.Tweet.User.account;
        delete reply.Tweet;
        return {
          ...reply,
          replyTo,
        };
      });
      return res.json(data);
    } catch (error) {
      return next(error);
    }
  },
  getUserLikes: async (req, res, next) => {
    const { id } = req.params;
    try {
      const foundUser = await User.findByPk(id);
      if (!foundUser || foundUser.isAdmin) {
        const error = new Error("使用者不存在!");
        error.status = 404;
        throw error;
      }
      const [likes, loginUser] = await Promise.all([
        Like.findAll({
          include: [
            {
              model: Tweet,
              attributes: ["description"],
              include: [
                {
                  model: User,
                  attributes: ["id", "name", "account", "avatar"],
                  required: true,
                },
                { model: Reply, attributes: ["id"] },
                { model: Like, attributes: ["id"] },
              ],
            },
          ],
          where: {
            UserId: id,
          },
          order: [["createdAt", "DESC"]],
        }),
        User.findByPk(getUser(req).id, {
          include: [{ model: Like, attributes: ["TweetId"] }],
        }),
      ]);
      const loginUserLikeTweetIds = loginUser?.Likes
        ? loginUser.Likes.map((ul) => ul.TweetId)
        : [];
      const data = likes.map((l) => {
        const { TweetId, createdAt, Tweet } = l.toJSON();
        const replyCounts = Tweet.Replies.length;
        const likeCounts = Tweet.Likes.length;
        delete Tweet.Replies;
        delete Tweet.Likes;
        return {
          id: TweetId,
          TweetId,
          createdAt, // - 什麼時候按喜歡推文
          ...Tweet,
          replyCounts,
          likeCounts,
          // - 目前登入的使用者有無按過喜歡
          isLiked: loginUserLikeTweetIds.some((tid) => tid === TweetId),
        };
      });
      return res.json(data);
    } catch (error) {
      return next(error);
    }
  },
  getUserFollowers: async (req, res, next) => {
    const { id } = req.params;
    try {
      const followers = await sequelize.query(
        `
      SELECT f.followerId AS id, f.followerId, u.account, u.name, u.avatar, u.introduction, f.createdAt AS followedDate
      FROM Followships AS f INNER JOIN Users AS u
      ON f.followerId = u.id
      WHERE followingId = ${id}
      ORDER BY followedDate DESC;
      `,
        { type: QueryTypes.SELECT }
      );
      return res.json(followers);
    } catch (error) {
      return next(error);
    }
  },
  getUserFollowings: async (req, res, next) => {
    const { id } = req.params;
    try {
      const followings = await sequelize.query(
        `
      SELECT f.followingId AS id, f.followingId, u.account, u.name, u.avatar, u.introduction, f.createdAt AS followedDate
      FROM Followships AS f INNER JOIN Users AS u
      ON f.followingId = u.id
      WHERE followerId = ${id}
      ORDER BY followedDate DESC;
      `,
        { type: QueryTypes.SELECT }
      );
      return res.json(followings);
    } catch (error) {
      return next(error);
    }
  },
  getTopUser: async (req, res, next) => {
    const loginUserId = getUser(req).id;
    const DEFAULT_LIMIT = 10;
    const limit = req.query.limit || DEFAULT_LIMIT;
    try {
      if (Number(limit) < 0) {
        const error = new Error("limit 不可小於 0 !");
        error.status = 404;
        throw error;
      }
      const users = await sequelize.query(
        `
        SELECT f.followingId AS id, u.account, u.name, u.avatar, u.introduction , COUNT(f.followingId) AS followerCounts
        FROM Followships AS f INNER JOIN Users AS u
        ON f.followingId = u.id
        GROUP BY f.followingId
        HAVING f.followingId <> ${loginUserId}
        ORDER BY followerCounts DESC, f.followingId ASC
        LIMIT ${limit};
        `,
        { type: QueryTypes.SELECT }
      );
      return res.json(users);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = userController;
