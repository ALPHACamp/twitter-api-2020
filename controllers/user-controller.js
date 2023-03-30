const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const defaultImageLink = require("../helpers/default-image-helper");
const { newError } = require("../helpers/error-helper");
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
      if (!name || !account || !email || !password || !checkPassword)
        throw newError(400, "欄位不可空白!");
      if (password !== checkPassword)
        throw newError(400, "密碼與確認密碼不符!");

      const [isEmailExist, isAccountExist] = await Promise.all([
        User.findOne({ where: { email } }),
        User.findOne({ where: { account } }),
      ]);

      if (isEmailExist) throw newError(400, "email 已重複註冊！");
      if (isAccountExist) throw newError(400, "account 已重複註冊！");

      const user = await User.create({
        name,
        account,
        email,
        avatar: defaultImageLink.avatar,
        cover: defaultImageLink.cover,
        introduction: "Please introduce yourself...",
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
      if (!account || !password) throw newError(400, "欄位不可空白!");

      const foundUser = await User.findOne({ where: { account } });

      if (!foundUser || foundUser.isAdmin) throw newError(404, "帳號不存在!");

      const isMatch = await bcrypt.compare(password, foundUser.password);

      if (!isMatch) throw newError(400, "密碼不正確!");

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
    const loginUserId = getUser(req).id;
    try {
      const foundUser = await User.findByPk(id, {
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
            [
              sequelize.literal(
                `(EXISTS (SELECT * FROM Followships AS f WHERE f.followerId = ${loginUserId} AND f.followingId = ${id}))`
              ),
              "isFollowed",
            ],
          ],
        },
      });

      if (!foundUser || foundUser.isAdmin) throw newError(404, "帳號不存在!");

      const user = foundUser.toJSON();
      delete user.password;
      return res.json({
        ...user,
        // - 目前登入的使用者有無追蹤查詢的使用者
        isFollowed: user.isFollowed === 1,
      });
    } catch (error) {
      return next(error);
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const foundUser = await User.findByPk(getUser(req).id);

      if (!foundUser) throw newError(404, "帳號不存在!");

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
      if (introduction.length > 160 || name.length > 50)
        throw newError(400, "字數超出上限！");

      if (getUser(req).id !== Number(id))
        throw newError(401, "無法更改他人資料!");

      const [foundUser, avatarLink, coverLink] = await Promise.all([
        User.findByPk(id),
        imgurFileHandler(avatarFile),
        imgurFileHandler(coverFile),
      ]);

      if (!foundUser || foundUser.isAdmin) throw newError(404, "帳號不存在!");

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
      if (getUser(req).id !== Number(id))
        throw newError(401, "無法更改他人資料!");

      if (!name || !account || !email || !password || !checkPassword)
        throw newError(400, "欄位不可空白!");

      if (password !== checkPassword)
        throw newError(400, "密碼與確認密碼不符!");

      // - 確認更改的新值 (email, account) 是否有自己以外的人已經擁有了
      const [isEmailExist, isAccountExist] = await Promise.all([
        User.findOne({ where: { email, id: { [Op.ne]: id } } }),
        User.findOne({ where: { account, id: { [Op.ne]: id } } }),
      ]);

      if (isEmailExist) throw newError(400, "email 已重複註冊！");

      if (isAccountExist) throw newError(400, "account 已重複註冊！");

      const foundUser = await User.findByPk(id);

      if (!foundUser || foundUser.isAdmin) throw newError(400, "帳號不存在！");

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
      if (getUser(req).id === Number(id)) throw newError(400, "無法追蹤自己!");

      const [foundUser, followship] = await Promise.all([
        User.findByPk(id, { raw: true }),
        Followship.findOne({
          where: {
            followerId: getUser(req).id,
            followingId: Number(id),
          },
        }),
      ]);

      if (followship) throw newError(400, "已追蹤過此使用者!");

      if (!foundUser || foundUser.isAdmin) throw newError(404, "帳號不存在！");

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
      if (getUser(req).id === Number(followingId))
        throw newError(400, "無法追蹤自己!");

      const foundUser = await User.findByPk(followingId, { raw: true });

      if (!foundUser || foundUser.isAdmin)
        throw newError(404, "使帳號不存在！");

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
    const loginUserId = getUser(req).id;
    try {
      const foundUser = await User.findByPk(id);

      if (!foundUser || foundUser.isAdmin) throw newError(404, "帳號不存在！");

      const tweets = await Tweet.findAll({
        attributes: [
          "id",
          "description",
          "UserId",
          "createdAt",
          [
            sequelize.literal(`
            (SELECT COUNT(r.id) from Replies as r WHERE Tweet.id = r.TweetId )
          `),
            "replyCounts",
          ],
          [
            sequelize.literal(`
            (SELECT COUNT(l.id) from Likes as l WHERE Tweet.id = l.TweetId )
          `),
            "likeCounts",
          ],
          [
            sequelize.literal(`
            (EXISTS (SELECT l.id from Likes as l WHERE Tweet.id = l.TweetId AND l.UserId = ${loginUserId}))
          `),
            "isLiked",
          ],
        ],
        where: {
          UserId: id,
        },
        order: [["createdAt", "DESC"]],
      });
      const data = tweets.map((t) => {
        const tweet = t.toJSON();
        return {
          ...tweet,
          // - 目前登入的使用者有無按過喜歡
          isLiked: tweet.isLiked === 1,
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

      if (!foundUser || foundUser.isAdmin) throw newError(404, "帳號不存在！");

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
    const loginUserId = getUser(req).id;
    try {
      const foundUser = await User.findByPk(id);

      if (!foundUser || foundUser.isAdmin) throw newError(404, "帳號不存在！");

      const likes = await Like.findAll({
        include: [
          {
            model: Tweet,
            attributes: [
              "description",
              [
                sequelize.literal(`
                  (SELECT COUNT(r.id) from Replies as r WHERE Tweet.id = r.TweetId )
                `),
                "replyCounts",
              ],
              [
                sequelize.literal(`
                  (SELECT COUNT(l.id) from Likes as l WHERE Tweet.id = l.TweetId )
                `),
                "likeCounts",
              ],
              [
                sequelize.literal(`
                  (EXISTS (SELECT l.id from Likes as l WHERE Tweet.id = l.TweetId AND l.UserId = ${loginUserId}))
                `),
                "isLiked",
              ],
            ],
            include: [
              {
                model: User,
                attributes: ["id", "name", "account", "avatar"],
                required: true,
              },
            ],
          },
        ],
        attributes: ["TweetId", "createdAt"],
        where: {
          UserId: id,
        },
        order: [["createdAt", "DESC"]],
      });
      const data = likes.map((l) => {
        const { TweetId, createdAt, Tweet } = l.toJSON();
        return {
          id: TweetId,
          TweetId,
          createdAt, // - 什麼時候按喜歡推文
          ...Tweet,
          // - 目前登入的使用者有無按過喜歡
          isLiked: Tweet.isLiked === 1
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
      if (Number(limit) < 0) throw newError(400, "limit 不可小於 0 !");

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
  patchUserCover: async (req, res, next) => {
    const currentUserId = getUser(req).id;
    const id = Number(req.params.id);
    try {
      // 先確認當前使用者只能修改自己的封面
      if (currentUserId !== id)
        throw newError(401, "無法修改其他使用者的封面照片!");

      const user = await User.findByPk(id, { attributes: ["id", "cover"] });
      const userCover = await user.update({
        cover:
          "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg",
      });
      return res.json(userCover);
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = userController;
