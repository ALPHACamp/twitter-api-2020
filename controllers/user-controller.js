const bcrypt = require("bcryptjs");
const { User, Tweet, Reply, Like } = require("../models");
const jwt = require("jsonwebtoken");
const { getUser } = require("../_helpers");
const Sequelize = require("sequelize");
const { Op, literal } = Sequelize;

const userController = {
  signUp: (req, res, next) => {
    const { name, account, email, password, checkPassword } = req.body;
    // Error: 密碼不相符
    if (password !== checkPassword) throw new Error("Passwords do not match");
    // Error: 必填項目
    if (!account || account.trim() === "") throw new Error("帳號為必填項目");
    if (!email || email.trim() === "") throw new Error("Email為必填項目");
    if (!password || password.trim() === "") throw new Error("密碼為必填項目");

    // 待設定password, name, account
    return User.findAll({
      [Op.or]: [{ where: { account } }, { where: { email } }],
    })
      .then((users) => {
        if (users.some((u) => u.email === email))
          throw new Error("email已重複註冊");
        if (users.some((u) => u.account === account))
          throw new Error("account已重複註冊");
        return bcrypt.hash(password, 10);
      })
      .then((hash) => {
        return User.create({
          name,
          account,
          email,
          password: hash,
          role: "user",
        });
      })
      .then((newUser) => {
        const user = newUser.toJSON();
        delete user.password;
        return res.status(200).json(user);
      })
      .catch((err) => next(err));
  },
  signIn: (req, res, next) => {
    const { account, password } = req.body;
    if (!account || !password)
      throw new Error("Account and password is required");
    return User.findOne({
      where: { account },
    })
      .then((user) => {
        if (!user) throw new Error("使用者不存在");
        if (user.role === "admin") throw new Error("使用者不存在");
        if (!bcrypt.compareSync(password, user.password))
          throw new Error("密碼不相符");
        const userData = user.toJSON();
        delete userData.password;
        const token = jwt.sign(userData, process.env.JWT_SECRET, {
          expiresIn: "30d",
        });
        return res.status(200).json({
          token,
          user: userData,
        });
      })
      .catch((err) => next(err));
  },
  getUserProfile: (req, res, next) => {
    const id = req.params.id || getUser(req).dataValues.id;
    return User.findByPk(id, {
      raw: true,
      nest: true,
      attributes: {
        include: [
          [
            Sequelize.literal(
              "(SELECT COUNT(DISTINCT id) FROM Followships WHERE Followships.following_id = user.id)"
            ),
            "follower",
          ],
          [
            Sequelize.literal(
              "(SELECT COUNT(DISTINCT id) FROM Followships WHERE Followships.follower_id = user.id)"
            ),
            "following",
          ],
          [
            Sequelize.literal(
              "(SELECT COUNT(id) FROM Tweets WHERE Tweets.user_id = user.id)"
            ),
            "tweetAmount",
          ],
        ],
        exclude: ["password", "createdAt", "updatedAt"],
      },
    })
      .then((user) => {
        if (!user) throw new Error("帳號不存在！");
        if (user.role === "admin") throw new Error("帳號不存在！");
        res.status(200).json(user);
      })
      .catch((err) => next(err));
  },
  putUserProfile: (req, res, next) => {
    const userId = Number(req.params.id);
    const { name, introduction, avatar, cover } = req.body;
    if (!name) throw new Error("name is required!");
    if (getUser(req).id !== userId) throw new Error("permission denied");
    return User.findByPk(userId)
      .then((user) => {
        if (!user) throw new Error("帳號不存在！");
        return user.update({
          name,
          introduction,
          avatar: avatar ? avatar : user.avatar,
          cover: cover ? cover : user.cover,
        });
      })
      .then((updatedUser) => res.status(200).json({ user: updatedUser }))
      .catch((err) => next(err));
  },

  getUserTweets: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Tweet.findAll({
        where: { userId: req.params.id },
        attributes: {
          include: [
            [
              literal(`(
                SELECT COUNT(*) 
                FROM replies AS reply
                WHERE 
                    reply.tweet_id = tweet.id
                )`),
              "replyCount",
            ],
            [
              literal(`(
                SELECT COUNT(*) 
                FROM likes AS liked
                WHERE 
                    liked.tweet_id = tweet.id
                )`),
              "likeCount",
            ],
          ],
          exclude: ["UserId"],
        },
        raw: true,
        nest: true,
      }),
    ])
      .then(([user, tweets]) => {
        // Error: user not found
        if (!user) {
          return res
            .status(404)
            .json({ status: "error", message: "No user found" });
        }
        // Error: tweets not found
        if (!tweets || tweets.length === 0) {
          return res
            .status(404)
            .json({ status: "error", message: "No tweets found" });
        }
        // sort tweets descending
        const result = tweets.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        return res.status(200).json(result);
      })

      .catch((err) => next(err));
  },

  getUserRepliedTweets: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Reply.findAll({
        where: { userId: req.params.id },
        include: [
          {
            model: Tweet,
            include: [
              { model: User, attributes: ["id", "name", "account", "avatar"] },
            ],
          },
        ],
        raw: true,
        nest: true,
      }),
    ])
      .then(([user, replies]) => {
        // Error: user not found
        if (!user) {
          return res
            .status(404)
            .json({ status: "error", message: "No user found" });
        }
        // Error: replies not found
        if (!replies || replies.length === 0) {
          return res
            .status(404)
            .json({ status: "error", message: "No replies found" });
        }
        return res.status(200).json(replies);
      })

      .catch((err) => next(err));
  },

  getUserLikes: (req, res, next) => {
    // unable to pass test request
    return Promise.all([
      User.findByPk(req.params.id),
      Like.findAll({
        where: { UserId: req.params.id },
        include: [
          {
            model: Tweet,
            include: [
              { model: User, attributes: ["id", "name", "account", "avatar"] },
            ],
          },
        ],
        raw: true,
        nest: true,
      }),
    ])
      .then(([user, likes]) => {
        // Error: user not found
        if (!user) {
          return res
            .status(404)
            .json({ status: "error", message: "No user found" });
        }
        // Error: likes not found
        if (!likes || likes.length === 0) {
          return res
            .status(404)
            .json({ status: "error", message: "No likes found" });
        }
        // sort likes descending
        const result = likes.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        return res.status(200).json(result);
      })

      .catch((err) => next(err));
  },
  getFollowings: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "Followings",
          attributes: [
            ["id", "followingId"],
            "name",
            "account",
            "avatar",
            "cover",
            "introduction",
          ],
        },
      ],
      attributes: [["id", "userId"], "name", "account", "avatar", "cover"],
    })
      .then((followings) => {
        if (followings.Followings.length === 0)
          return res.status(200).json({ isEmpty: true });
        const followingId = getUser(req).Followings.map((user) => user.id);
        const result = followings.Followings.map((f) => ({
          ...f.toJSON(),
          isFollowed: followingId.includes(f.toJSON().followingId) || false,
        })).sort(
          (a, b) =>
            b.Followship.createdAt.getTime() - a.Followship.createdAt.getTime()
        );
        result.forEach((i) => delete i.Followship);
        return res.json(result);
      })
      .catch((err) => next(err));
  },
  getFollowers: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "Followers",
          attributes: [
            ["id", "followerId"],
            "name",
            "account",
            "avatar",
            "cover",
            "introduction",
          ],
        },
      ],
      attributes: [["id", "userId"], "name", "account", "avatar", "cover"],
    })
      .then((followers) => {
        if (followers.Followers.length === 0)
          return res.status(200).json({ isEmpty: true });
        const followingId = getUser(req).Followings.map((user) => user.id);
        const result = followers.Followers.map((f) => ({
          ...f.toJSON(),
          isFollowed: followingId.includes(f.toJSON().followerId) || false,
        })).sort(
          (a, b) =>
            b.Followship.createdAt.getTime() - a.Followship.createdAt.getTime()
        );
        result.forEach((i) => delete i.Followship);
        return res.json(result);
      })
      .catch((err) => next(err));
  }
};
module.exports = userController;
