const bcrypt = require("bcryptjs");
const imgur = require("imgur-node-api");
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const { Op } = require('sequelize')
const helpers = require("../_helpers");
const db = require("../models");
const Tweet = db.Tweet;
const Reply = db.Reply;
const User = db.User;
const Like = db.Like;
const Followship = db.Followship;

// JWT
const jwt = require('jsonwebtoken')

const userService = {
  getUser: (req, res, callback) => {
    return Promise.all([
      User.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          { model: User, as: "Followers" },
          { model: User, as: "Followings" },
        ],
      }),
      Tweet.findAll({
        where: {
          UserId: req.params.id,
        },
      }),
    ]).then(([user, tweets]) => {
      user = {
        ...user.dataValues,
        FollowersCount: user.Followers.length,
        FollowingsCount: user.Followings.length,
        isFollower: user.Followers.map((d) => d.id).includes(
          helpers.getUser(req).id
        ),
        tweetsCount: tweets.length,
      };
      return callback(user);
    });
  },
  addFollowing: (req, res, callback) => {
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.body.id,
    }).then((followship) => {
      return callback({ status: "success", message: "following User!" });
    });
  },
  removeFollowing: (req, res, callback) => {
    return Followship.destroy({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.followingId,
      },
    }).then((followship) => {
      return callback({ status: "success", message: "User unfollowed." });
    });
  },
  getUserTweets: (req, res, callback) => {
    return Tweet.findAll({
      where: {
        UserId: Number(req.params.userId),
      },
      order: [["createdAt", "DESC"]],
      include: [User, Reply, Like],
    }).then((tweets) => {
      if (!tweets) {
        return callback({ status: "error", message: "No tweet found." });
      }
      tweets = tweets.map((tweet) => {
        let isLike = tweet.Likes.find(
          (d) => d.UserId === helpers.getUser(req).id
        );
        isLike = !isLike ? false : isLike.isLike;
        let likeCount = tweet.Likes.filter((d) => d.isLike === true).length;
        return {
          ...tweet.dataValues,
          tweetReplyCount: tweet.Replies.length,
          tweetLikeCount: likeCount,
          isLike: isLike,
        };
      });
      return callback(tweets);
    });
  },
  getUserReplies: (req, res, callback) => {
    return Reply.findAll({
      where: {
        UserId: Number(req.params.userId),
      },
      order: [["createdAt", "DESC"]],
      include: [User, { model: Tweet, include: [User] }],
    }).then((tweets) => {
      tweets = tweets.map((d) => {
        d.User = {
          UserId: d.User.id,
          avatar: d.User.avatar,
          name: d.User.name,
          account: d.User.account,
          introduction: d.User.introduction,
          createdAt: d.User.createdAt,
        };
        return { ...d.dataValues, User: d.User };
      });
      return callback(tweets);
    });
  },
  getUserLikes: (req, res, callback) => {
    return Like.findAll({
      where: {
        UserId: Number(req.params.userId),
      },
      order: [["createdAt", "DESC"]],
      include: [User, { model: Tweet, include: [User, Reply, Like] }],
    }).then((tweets) => {
      if (!tweets) {
        return callback({ status: "error", message: "No liked tweet found." });
      }
      tweets = tweets.map((d) => {
        let isLike = d.Tweet.Likes.some(
          (l) => l.UserId === helpers.getUser(req).id
        );
        return {
          ...d.dataValues,
          tweetReplyCount: d.Tweet.Replies.length,
          tweetLikeCount: d.Tweet.Likes.filter((d) => d.isLike === true).length,
          isLike: isLike,
        };
      });
      return callback({ tweets: tweets });
    });
  },
  getFollowers: (req, res, callback) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "Followers",
        },
      ],
    }).then((followers) => {
      followers = followers.Followers.map((d, index) => {
        let followerId;
        if (!d.Followship.followerId) {
          followerId = false;
        }
        followerId = d.Followship.followerId;
        return { ...d.dataValues, followerId };
      });
      return callback(followers);
    });
  },
  getFollowings: (req, res, callback) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "Followings",
        },
      ],
    }).then((followings) => {
      followings = followings.Followings.map((d, index) => {
        let followingId;
        if (!d.Followship.followingId) {
          followingId = false;
        }
        followingId = d.Followship.followingId;
        return { ...d.dataValues, followingId };
      });
      return callback(followings);
    });
  },
  getTopUser: (req, res, callback) => {
    return User.findAll({
      include: [{ model: User, as: "Followers" }],
    }).then((users) => {
      users = users.map((user) => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: helpers.getUser(req).Followings
          ? helpers
              .getUser(req)
              .Followings.map((d) => d.id)
              .includes(user.id)
          : false,
      }));
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount);
      users = users.slice(1, 10);
      callback({ users: users });
    });
  },
  deleteAllUsers: (req, res, callback) => {
    User.destroy({
      where: {},
      truncate: true,
    }).then(() => {
      callback({ status: "success", message: "All users killed." });
    });
  },
  deleteAllTweets: (req, res, callback) => {
    Tweet.destroy({
      where: {},
      truncate: true,
    }).then(() => {
      callback({ status: "success", message: "All tweets killed." });
    });
  },
  deleteAllReplies: (req, res, callback) => {
    Reply.destroy({
      where: {},
      truncate: true,
    }).then(() => {
      callback({ status: "success", message: "All replies killed." });
    });
  },
  addLike: (req, res, callback) => {
    Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id,
      },
    })
      .then((like) => {
        if (!like) {
          return Like.create({
            UserId: helpers.getUser(req).id,
            TweetId: req.params.id,
            isLike: true,
          }).then((like) => {
            return callback({ status: "success", message: "Tweet liked." });
          });
        }
        if (like.isLike === false) {
          return like.update({ ...like, isLike: !like.isLike }).then((like) => {
            return callback({ status: "success", message: "Tweet liked." });
          });
        }
        return callback({
          status: "error",
          message: "This tweet is already liked.",
        });
      })
      .catch((err) => console.log(err));
  },
  removeLike: (req, res, callback) => {
    Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id,
      },
    })
      .then((like) => {
        if (!like) {
          return Like.create({
            UserId: helpers.getUser(req).id,
            TweetId: req.params.id,
            isLike: false,
          }).then((like) => {
            return callback({ status: "success", message: "Tweet unliked." });
          });
        } else if (like.isLike === true) {
          return like.destroy().then((like) => {
            return callback({ status: "success", message: "Tweet unliked." });
          });
        } else {
          return like.destroy().then((like) => {
            return callback({
              status: "error",
              message: "You have already unliked this tweet.",
            });
          });
        }
      })
      .catch((err) => console.log(err));
  },

  profileUser: async (req, res, callback) => {
    try {
      const [user] = await Promise.all([
        User.findByPk(helpers.getUser(req).id),
      ]);
      return callback({ user: user });
    } catch (e) {
      console.warn(e);
    }
  },

  putUser: async (req, res, callback) => {
    try {
      if (Number(req.params.id) !== Number(helpers.getUser(req).id)) {
        return callback({ status: "error", message: "Unauthorized." });
      }

      const { name, introduction, avatar, cover } = req.body;
      const { files } = req;

      const user = await User.findByPk(req.params.id);
      // 如果user要把cover給刪掉，前端會回傳cover: delete
      if (cover === "delete") {
        user.cover = "https://i.imgur.com/Qqb0a7S.png";
      }

      if (!files) {
        await user.update({
          name,
          introduction,
          avatar,
          cover: user.cover,
        });
        return callback({
          status: "success",
          message: "Edit successful. No image uploaded",
        });
      } else {
        imgur.setClientID(IMGUR_CLIENT_ID);
        const uploadImg = (file) => {
          return new Promise((resolve, reject) => {
            imgur.upload(file, (err, res) => {
              resolve(res.data.link);
            });
          });
        };

        const newAvatar = files.avatar
          ? await uploadImg(files.avatar[0].path)
          : user.avatar;
        const newCover = files.cover
          ? await uploadImg(files.cover[0].path)
          : user.cover;

        await user.update({
          name,
          introduction,
          avatar: newAvatar,
          cover: newCover,
        });
        return callback({
          status: "success",
          message: "Edit successful. Image uploaded.",
        });
      }
    } catch (err) {
      return callback({ status: "error", message: "Edit failed." });
    }
  },

  reviseUser: async (req, res, callback) => {
    try {
      const { name, account, email, password, checkPassword } = req.body;
      if (Number(req.params.id) !== Number(helpers.getUser(req).id)) {
        return callback({ status: "error", message: "Unauthorized" });
      }

      if (account !== helpers.getUser(req).account) {
        const existUser = await User.findOne({
          where: { account },
          raw: true,
        });
        if (existUser)
          return callback({ status: "error", message: "This account already exists." });
      }

      if (email !== helpers.getUser(req).email) {
        const existUser = await User.findOne({
          where: { email },
          raw: true,
        });
        if (existUser)
          return callback({ status: "error", message: "This email already exists." });
      }

      if (password !== checkPassword) {
        return callback({ status: "error", message: "Password inconsistent with check password." });
      }

      const user = await User.findByPk(req.params.id);
      await user.update({
        name,
        account,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
      });

      return callback({ status: "success", message: "Edit successful." });
    } catch (err) {
      console.log(err);
      return callback({ status: "error", message: "Edit failed." });
    }
  },
};
  
module.exports = userService

