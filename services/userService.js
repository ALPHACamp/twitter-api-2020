const bcrypt = require("bcryptjs");
const imgur = require("imgur-node-api");
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const { Op } = require('sequelize')
const helpers = require("../_helpers");
const db = require("../models");
const user = require("../models/user");
const Tweet = db.Tweet;
const Reply = db.Reply;
const User = db.User;
const Like = db.Like;
const Followship = db.Followship;

const userService = {
  getUser: (req, res, callback) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    User.findByPk(req.params.id , {
       include: [
          { model: User, as: "Followers" },
          { model: User, as: "Followings" },
        ]}).then((user) => {
          user = {
            ...user.dataValues,
            FollowersCount: user.Followers.length,
            FollowingsCount: user.Followings.length,
          };
      return callback({ user: user });
    });
  },
  // getUser: (req, res) => {
  //   const currentUser = req.user ? req.user : helpers.getUser(req);
  //   User.findOne({ where: { id: req.params.id } }).then((user) => {
  //     return res.json({ user: user });
  //     // User.findOne({ where: { id: currentUser.id } }).then((user) => {
  //     // return res.render("profile", { user: user });
  //   });
  // },
  putUser: (req, res, callback) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    if (currentUser.id !== Number(req.params.id)) {
      console.log(req, user, currentUser, helpers.getUser(req));
      callback({ status: "error", message: "只能編輯自己的資訊." });
      // req.flash("error_messages", "只能編輯自己的資訊")
      // return res.redirect(`/users/${currentUser.id}`)
    }
    const { file } = req;
    return Promise.all([
      User.findAll({
        where: {
          email: { [Op.not]: currentUser.email },
        },
      }),
      User.findAll({
        where: {
          account: { [Op.not]: currentUser.account },
        },
      }),
    ]).then(([usersEmail, usersAccount]) => {
      let emailCheck = usersEmail.map((d) => d.email).includes(req.body.email);
      let accountCheck = usersAccount
        .map((d) => d.account)
        .includes(req.body.account);
      console.log("emailCheck", emailCheck, "accountCheck", accountCheck);
      if (
        !req.body.name ||
        !req.body.email ||
        !req.body.account ||
        !req.body.password ||
        !req.body.checkPassword
      ) {
        callback({
          status: "error",
          message: "名字，信箱，帳號，密碼，確認密碼不能為空!",
        });
        // req.flash( "error_messages", "名字，信箱，帳號，密碼，確認密碼不能為空!");
        // return res.redirect("back");
      }
      if (req.body.password !== req.body.checkPassword) {
        callback({ status: "error", message: "密碼與確認密碼不一致!" });
        // req.flash("error_messages", "密碼與確認密碼不一致!");
        // return res.redirect("back");
      }
      if (emailCheck) {
        callback({ status: "error", message: "此信箱己被註冊，請更改!" });
        // req.flash("error_messages", "此信箱己被註冊，請更改!");
        // return res.redirect("back");
      }
      if (accountCheck) {
        callback({
          status: "error",
          message: "帳戶名稱已被其他使用者使用，請更改!",
        });
        // req.flash("error_messages", "帳戶名稱已被其他使用者使用，請更改!")
        // return res.redirect("back");
      }
      if (file) {
        // fs.readFile(file.path, (err, data) => {
        imgur.setClientID(IMGUR_CLIENT_ID);
        imgur.upload(file.path, (err, img) => {
          // if (err) console.log("Error: ", err);
          // fs.writeFile(`upload/${file.originalname}`, data, () => {
          return User.findByPk(req.params.id).then((user) => {
            user
              .update({
                ...req.body,
                cover: file ? img.data.link : user.cover,
                avatar: file ? img.data.link : user.avatar,
                // cover: file ? `/upload/${file.originalname}` : req.body.cover,
                // avatar: file ? `/upload/${file.originalname}` : req.body.avatar,
                password: bcrypt.hashSync(
                  req.body.password,
                  bcrypt.genSaltSync(10),
                  null
                ),
              })
              .then((user) => {
                callback({
                  status: "success",
                  message: "使用者資料編輯成功。",
                });
                // req.flash("success_messages", "使用者資料編輯成功");
                // res.redirect(`/users/${req.params.id}`);
              });
          });
        });
        // });
      } else {
        return User.findByPk(req.params.id).then((user) => {
          user
            .update({
              ...req.body,
              cover: user.cover,
              avatar: user.avatar,
              password: bcrypt.hashSync(
                req.body.password,
                bcrypt.genSaltSync(10),
                null
              ),
            })
            .then(() => {
              callback({ status: "success", message: "使用者資料編輯成功。" });
              // req.flash("success_messages", "使用者編輯成功");
              // return res.redirect(`/users/${req.params.id}`);
            });
        });
      }
    });
    // putUser: (req, res) => {
    // const { file } = req;
    // const currentUser = req.user ? req.user : helpers.getUser(req);
    // return Promise.all([
    //   User.findAll({
    //     where: {
    //       email: { [Op.not]: currentUser.email },
    //     },
    //   }),
    //   User.findAll({
    //     where: {
    //       account: { [Op.not]: currentUser.account },
    //     },
    //   }),
    // ]).then(([usersEmail, usersAccount]) => {
    //   let emailCheck = usersEmail.map((d) => d.email).includes(req.body.email);
    //   let accountCheck = usersAccount
    //     .map((d) => d.account)
    //     .includes(req.body.account);
    //   console.log("emailCheck", emailCheck, "accountCheck", accountCheck);
    //   if (
    //     !req.body.name ||
    //     !req.body.email ||
    //     !req.body.account ||
    //     !req.body.password ||
    //     !req.body.passwordCheck
    //   ) {
    //     req.flash(
    //       "error_messages",
    //       "名字，信箱，帳號，密碼，確認密碼不能為空!"
    //     );
    //     return res.redirect("back");
    //   }
    //   if (req.body.password !== req.body.passwordCheck) {
    //     req.flash("error_messages", "密碼與確認密碼不一致!");
    //     return res.redirect("back");
    //   }
    //   if (emailCheck) {
    //     req.flash("error_messages", "此信箱己被註冊，請更改!");
    //     return res.redirect("back");
    //   }
    //   if (accountCheck) {
    //     req.flash("error_messages", "帳戶名稱已被其他使用者使用，請更改!");
    //     return res.redirect("back");
    //   }
    //   if (file) {
    //     // fs.readFile(file.path, (err, data) => {
    //       imgur.setClientID(IMGUR_CLIENT_ID)
    //       imgur.upload(file.path, (err, img) => {
    //       // if (err) console.log("Error: ", err);
    //       // fs.writeFile(`upload/${file.originalname}`, data, () => {
    //         return User.findByPk(req.params.id).then((user) => {
    //           user
    //             .update({
    //               ...req.body,
    //               cover: file ? img.data.link : user.cover,
    //               avatar: file ? img.data.link : user.avatar,
    //               // cover: file ? `/upload/${file.originalname}` : req.body.cover,
    //               // avatar: file ? `/upload/${file.originalname}` : req.body.avatar,
    //               password: bcrypt.hashSync(
    //                 req.body.password,
    //                 bcrypt.genSaltSync(10),
    //                 null
    //               ),
    //             })
    //             .then((user) => {
    //               req.flash("success_messages", "使用者資料編輯成功");
    //               res.redirect(`/users/${req.params.id}`);
    //             });
    //         });
    //       });
    //     // });
    //   } else {
    //     return User.findByPk(req.params.id).then((user) => {
    //       user
    //         .update({
    //           ...req.body,
    //           cover: user.cover,
    //           avatar: user.avatar,
    //           password: bcrypt.hashSync(
    //             req.body.password,
    //             bcrypt.genSaltSync(10),
    //             null
    //           ),
    //         })
    //         .then(() => {
    //           req.flash("success_messages", "使用者編輯成功");
    //           return res.redirect(`/users/${req.params.id}`);
    //         });
    //     });
    //   }
    // });
    // },
  },

  addLike: (req, res, callback) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    Like.findOne({
      where: {
        UserId: Number(currentUser.id),
        TweetId: Number(req.params.id),
      },
    }).then((like) => {
      if (!like) {
        return Like.create({
          UserId: Number(currentUser.id),
          TweetId: Number(req.params.id),
          isLike: true,
        }).then((like) => {
          return callback({ status: "error", message: "" });
        });
      }
      if (like.isLike === false) {
        return like.update({ ...like, isLike: !like.isLike }).then((like) => {
          return callback({ status: "success", message: "" });
        });
      }
      return callback({ status: "error", message: "" });
    });
  },
  removeLike: (req, res, callback) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    Like.findOne({
      where: {
        UserId: Number(currentUser.id),
        TweetId: Number(req.params.id),
      },
    }).then((like) => {
      if (!like) {
        return Like.create({
          UserId: Number(currentUser.id),
          TweetId: Number(req.params.id),
          isLike: false,
        }).then((like) => {
          return callback({ status: "error", message: "" });
        });
      }
      if (like.isLike === true) {
        return like.update({ ...like, isLike: !like.isLike }).then((like) => {
          return callback({ status: "success", message: "" });
        });
      }
      return callback({ status: 'error', message: '' })
    });
  },

  addFollowing: (req, res, callback) => {
    const currentUser = req.user ? req.user : helpers.getUser(req)
    return Followship.create({
      followerId: currentUser.id,
      followingId: Number(req.params.id),
    }).then((followship) => {
      return callback({ status: "success", message: "" });
    });
  },
  removeFollowing: (req, res, callback) => {
    const currentUser = req.user ? req.user : helpers.getUser(req)
    return Followship.findOne({
      where: {
        followerId: currentUser.id,
        followingId: Number(req.params.id),
      },
    }).then((followship) => {
      followship.destroy().then((followship) => {
        return callback({ status: "success", message: "" });
      });
    });
  },
  getUserTweets: (req, res, callback) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    return Promise.all([
      User.findByPk(req.params.userId, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Tweet.findAll({
        where: {
          UserId: Number(req.params.userId),
        },
        order: [["createdAt", "DESC"]],
        include: [User, Reply, Like],
      })
    ]).then(([user, tweets]) => {
      user = {
        ...user.dataValues,
        FollowersCount: user.Followers.length,
        FollowingsCount: user.Followings.length,
        isFollower: user.Followers.map((d) => d.id).includes(currentUser.id),
      };
      let newTweets = tweets.map((tweet) => {
        let isLike = tweet.Likes.find((d) => d.UserId === currentUser.id);
        isLike = !isLike ? false : isLike.isLike;
        let likeCount = tweet.Likes.filter((d) => d.isLike === true).length;
        return {
          ...tweet.dataValues,
          tweetReplyCount: tweet.Replies.length,
          tweetLikeCount: likeCount,
          isLike: isLike,
        };
      });
      let tweetCount = tweets.length 
      return callback({ tweets: newTweets, user: user, tweetCount: tweetCount });

    });
  },
  getUserReplies: (req, res, callback) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    return Promise.all([
      User.findByPk(req.params.userId, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Reply.findAll({
        where: {
          UserId: Number(req.params.userId),
        },
        order: [["createdAt", "DESC"]],
        include: [User, { model: Tweet, include: [User] }],
      }),
    ]).then(([user, tweets]) => {
      user = {
        ...user.dataValues,
        FollowersCount: user.Followers.length,
        FollowingsCount: user.Followings.length,
        isFollower: user.Followers.map((d) => d.id).includes(currentUser.id),
      };
      let newTweets = tweets.map((d) => {
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
      let tweetCount = tweets.length;
      return callback({ tweets: newTweets, user: user, tweetCount: tweetCount });
    });
  },
  getUserLikes: (req, res, callback) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    return Promise.all([
      User.findByPk(req.params.userId, {
        include: [
          { model: User, as: "Followers" },
          { model: User, as: "Followings" },
        ],
      }),
      Like.findAll({
        where: {
          UserId: Number(req.params.userId),
          isLike: true
        },
        order: [["createdAt", "DESC"]],
        include: [User, { model: Tweet, include: [User, Reply, Like] }],
      }),
    ]).then(([user, tweets]) => {
      user = {
        ...user.dataValues,
        FollowersCount: user.Followers.length,
        FollowingsCount: user.Followings.length,
        isFollower: user.Followers.map((d) => d.id).includes(currentUser.id),
      };
      // console.log(currentUser.id, req.params.userId);
      let newTweets = tweets.map((d) => {
        // let isLike = d.Tweet.Likes.map((l) => l.UserId).includes(
        //   currentUser.id)
        // let isLike = d.Tweet.Likes.map((l) => l.UserId).includes(
        //   Number(req.params.userId)
        // );
        let isLike 
        if (currentUser.id === user.id) {
          isLike = true
        } else {
          // isLike = false
          isLike = d.Tweet.Likes.map((l) => l.UserId).includes(
          Number(req.params.userId))
        }
        
      //  console.log(isLike)
       return { ...d.dataValues, 
         tweetReplyCount: d.Tweet.Replies.length,
          tweetLikeCount: d.Tweet.Likes.filter((d) => d.isLike === true
          ).length,
          isLike: isLike
        }
      });
      // newTweets.forEach(d => console.log(d.isLike))
      let tweetCount = tweets.length;
      // console.log(newTweets);
      return callback({ tweets: newTweets, user: user, tweetCount:tweetCount });
    });
  },
  getFollowers: (req, res, callback) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    return User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followers', include: [{ model: User, as: 'Followers' }] }]
    })
      .then(result => {
        const followersCount = result.Followers.length
        const thoseWeFollows = [] //those users that follows the user who are followed by the user as well 
        const ff = result.Followers.map(d => d.Followers)
        for (i = 0; i < ff.length; i++) {
          for (j = 0; j < ff[i].length; j++) {
            if (ff[i][j].id === currentUser.id) {
              thoseWeFollows.push(ff[i][j].Followship.followingId)
            }
          }
        }
        callback({ result, followersCount, thoseWeFollows })
      })
  },
  getFollowings: (req, res, callback) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    return User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followings', include: [{ model: User, as: 'Followers' }] }]
    })
      .then(result => {
        const followersCount = result.Followings.length
        const thoseWeFollows = [] //those who the user and the req.user both follows 
        const ff = result.Followings.map(d => d.Followers)
        for (i = 0; i < ff.length; i++) {
          for (j = 0; j < ff[i].length; j++) {
            if (ff[i][j].id === currentUser.id) {
              thoseWeFollows.push(ff[i][j].Followship.followingId)
            }
          }
        }
        callback({ result, followersCount, thoseWeFollows })
      })
  },
  getTopUser: (req, res, callback) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: currentUser.Followings ? currentUser.Followings.map(d => d.id).includes(user.id) : false
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      users = users.slice(1,10)
      callback({ users: users })
    })
  },
  deleteAllUsers: (req, res, callback) => {
    User.destroy({
      where: {},
      truncate: true
    }).then(() => {
      callback({ status: "success", message: "all users killed" })
    })
  },
  deleteAllTweets: (req, res, callback) => {
    Tweet.destroy({
      where: {},
      truncate: true
    }).then(() => {
      callback({ status: "success", message: "all tweets killed" })
    })
  },
  deleteAllReplies: (req, res, callback) => {
    Reply.destroy({
      where: {},
      truncate: true
    }).then(() => {
      callback({ status: "success", message: "all replies killed" })
    })
  }
};

module.exports = userService