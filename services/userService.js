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
      return callback({ status: "success", message: "追隨成功" });
    });
  },
  removeFollowing: (req, res, callback) => {
    return Followship.destroy({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.followingId,
      },
    }).then((followship) => {
      return callback({ status: "success", message: "取消追隨成功" });
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
        return callback({ status: "error", message: "目前沒有推文" });
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
      if (!tweets) {
        return callback({ status: "error", message: "沒有對回覆的推文" });
      }
      tweets = tweets.map((d) => {
        d.User = {
          UserId: d.User.id,
          avatar: d.User.avatar,
          name: d.User.name,
          account: d.User.account,
          introduction: d.User.introduction,
          createdAt: d.User.createdAt,
        };
        return d;
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
        return callback({ status: "error", message: "沒有使用者喜歡的推文" });
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
      callback({ status: "success", message: "all users killed" });
    });
  },
  deleteAllTweets: (req, res, callback) => {
    Tweet.destroy({
      where: {},
      truncate: true,
    }).then(() => {
      callback({ status: "success", message: "all tweets killed" });
    });
  },
  deleteAllReplies: (req, res, callback) => {
    Reply.destroy({
      where: {},
      truncate: true,
    }).then(() => {
      callback({ status: "success", message: "all replies killed" });
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
            return callback({ status: "success", message: "喜歡此筆推文。" });
          });
        }
        if (like.isLike === false) {
          return like.update({ ...like, isLike: !like.isLike }).then((like) => {
            return callback({ status: "success", message: "喜歡此筆推文。" });
          });
        }
        return callback({
          status: "error",
          message: "錯誤 ! 此筆推文己喜歡。",
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
            return callback({ status: "success", message: "此筆推文取消喜歡" });
          });
        } else if (like.isLike === true) {
          return like.destroy().then((like) => {
            return callback({ status: "success", message: "此筆推文取消喜歡" });
          });
        } else {
          return like.destroy().then((like) => {
            return callback({
              status: "error",
              message: "錯誤 ! 此筆推文己取消喜歡。",
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
      console.log("我在編輯頁面");
      try {
        if (helpers.getUser(req).id !== Number(req.params.id)) {
          callback({ status: "error", message: "只能編輯自己的資訊." });
        }
        const [user] = await Promise.all([
          User.findByPk(helpers.getUser(req).id),
        ]);
        console.log('己經拿到資料')
        const { files } = req;
        imgur.setClientID(IMGUR_CLIENT_ID);
        if (files) {
          if (files.cover && !files.avatar) {
            console.log("只有大頭照");
            imgur.upload(files.cover[0].path, async (err, coverImg) => {
              try {
                if (err) console.log("Error: ", err);
                let cover = await coverImg;
                await user
                  .update({
                    ...req.body,
                    cover: cover.data.link,
                  })
                  .then((user) => {
                    callback({
                      status: "success",
                      message: "使用者資料編輯成功。",
                    });
                  });
              } catch (e) {
                console.warn(e);
              }
            });
          } else if (!files.cover && files.avatar) {
            console.log("只有背景照");
            imgur.upload(files.avatar[0].path, async (err, avatarImg) => {
              if (err) console.log("Error: ", err);
              let avatar = await avatarImg;
              await user
                .update({
                  ...req.body,
                  avatar: avatar.data.link,
                })
                .then((user) => {
                  callback({
                    status: "success",
                    message: "使用者資料編輯成功。",
                  });
                });
              try {
              } catch (e) {
                console.warn(e);
              }
            });
          } else if (files.cover && files.avatar) {
            console.log("贡張都有");
            imgur.upload(files.cover[0].path, async (err, coverImg) => {
              if (err) console.log("Error: ", err);
              imgur.upload(files.avatar[0].path, async (err, avatarImg) => {
                try {
                  if (err) console.log("Error: ", err);
                  let cover = await coverImg;
                  let avatar = await avatarImg;
                  user
                    .update({
                      ...req.body,
                      cover: cover.data.link,
                      avatar: avatar.data.link,
                    })
                    .then((user) => {
                      return callback({
                        status: "success",
                        message: "使用者資料編輯成功。",
                      });
                    });
                } catch (e) {
                  console.warn(e);
                }
              });
            });
          } else {
            console.log("都沒有照片");
            user.update(req.body).then(() => {
              return callback({
                status: "success",
                message: "使用者資料編輯成功。",
              });
            });
          }
        } else {
          console.log("都沒有照片");
          user.update(req.body).then(() => {
            return callback({
              status: "success",
              message: "使用者資料編輯成功。",
            });
          });
        }
      } catch (e) {
        console.warn(e);
        callback({
          status: "error",
          message: "使用者資料編輯失敗。",
        });
      }
    },

  reviseUser: (req, res, callback) => {
    console.log('我在帳戶設定頁',req.body)
    const { name, email, account, password, checkPassword } = req.body;
    const userId = helpers.getUser(req).id;
    if (userId !== Number(req.params.id)) {
      callback({ status: "error", message: "只能編輯自己的資訊." });
    }
    return Promise.all([
      User.findAll({
        where: {
          email: { [Op.not]: helpers.getUser(req).email },
        },
      }),
      User.findAll({
        where: {
          account: { [Op.not]: helpers.getUser(req).account },
        },
      }),
      User.findByPk(userId)
    ]).then(([usersEmail, usersAccount, user]) => {
      console.log('我己經拿到資料了')
      const emailCheck = usersEmail.map((d) => d.email).includes(email);
      const accountCheck = usersAccount.map((d) => d.account).includes(account);
      if (!name || !email || !account || !password || !checkPassword) {
        callback({
          status: "error",
          message: "名字，信箱，帳號，密碼，確認密碼不能為空!",
        });
      }
      if (password !== checkPassword) {
        callback({ status: "error", message: "密碼與確認密碼不一致!" });
      }
      if (emailCheck) {
        callback({ status: "error", message: "此信箱己被註冊，請更改!" });
      }
      if (accountCheck) {
        callback({
          status: "error",
          message: "帳戶名稱已被其他使用者使用，請更改!",
        });
      }
      console.log('都己經通了',name, email, account, password, checkPassword);
      return user
        .update({
          name: name,
          email: email,
          account: account,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        })
        .then((user) => {
          console.log('也己經編輯了')
          return callback({
            status: "success",
            message: "使用者資料編輯成功。",
          });
        });
    });
  },


  // putUser: async (req, res, callback) => {
  //   try {
  //     if (Number(req.params.id) !== Number(helpers.getUser(req).id)) {
  //       return callback({ status: "error", message: "沒有編輯權限！" });
  //     }

  //     const { name, introduction, avatar, cover } = req.body;
  //     const { files } = req;

  //     const user = await User.findByPk(req.params.id);
  //     // 如果user要把cover給刪掉，前端會回傳cover: delete
  //     if (cover === "delete") {
  //       user.cover = "https://i.imgur.com/Qqb0a7S.png";
  //     }

  //     if (!files) {
  //       await user.update({
  //         name,
  //         introduction,
  //         avatar,
  //         cover: user.cover,
  //       });
  //       return callback({
  //         status: "success",
  //         message: "使用者資料編輯成功！(沒傳圖）",
  //       });
  //     } else {
  //       imgur.setClientID(IMGUR_CLIENT_ID);
  //       const uploadImg = (file) => {
  //         return new Promise((resolve, reject) => {
  //           imgur.upload(file, (err, res) => {
  //             resolve(res.data.link);
  //           });
  //         });
  //       };

  //       const newAvatar = files.avatar
  //         ? await uploadImg(files.avatar[0].path)
  //         : user.avatar;
  //       const newCover = files.cover
  //         ? await uploadImg(files.cover[0].path)
  //         : user.cover;

  //       await user.update({
  //         name,
  //         introduction,
  //         avatar: newAvatar,
  //         cover: newCover,
  //       });
  //       return callback({
  //         status: "success",
  //         message: "使用者資料編輯成功！(有傳圖）",
  //       });
  //     }
  //   } catch (err) {
  //     return callback({ status: "error", message: "編輯未成功！" });
  //   }
  // },

  // reviseUser: async (req, res, callback) => {
  //   try {
  //     const { name, account, email, password, checkPassword } = req.body;
  //     if (Number(req.params.id) !== Number(helpers.getUser(req).id)) {
  //       return callback({ status: "error", message: "沒有編輯權限！" });
  //     }

  //     if (account !== helpers.getUser(req).account) {
  //       const existUser = await User.findOne({
  //         where: { account },
  //         raw: true,
  //       });
  //       if (existUser)
  //         return callback({ status: "error", message: "account 已重覆註冊！" });
  //     }

  //     if (email !== helpers.getUser(req).email) {
  //       const existUser = await User.findOne({
  //         where: { email },
  //         raw: true,
  //       });
  //       if (existUser)
  //         return callback({ status: "error", message: "email 已重覆註冊！" });
  //     }

  //     if (password !== checkPassword) {
  //       return callback({ status: "error", message: "兩次密碼輸入不同！" });
  //     }

  //     const user = await User.findByPk(req.params.id);
  //     await user.update({
  //       name,
  //       account,
  //       email,
  //       password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
  //     });

  //     return callback({ status: "success", message: "使用者資料編輯成功！" });
  //   } catch (err) {
  //     console.log(err);
  //     return callback({ status: "error", message: "編輯未成功！" });
  //   }
  // },
};
  
module.exports = userService

