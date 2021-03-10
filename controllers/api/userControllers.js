const bcrypt = require('bcryptjs');
const helpers = require('../../_helpers');
const { User, Followship, Tweet, Reply, Like } = require('../../models');
const Op = require('sequelize').Op;
const imgur = require('imgur');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

const sequelize = require('sequelize');

// JWT
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const user = require('../../models/user');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

let userController = {
  signUp: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body;
    if (!account || !name || !email || !password) {
      return res.json({ status: 'error', message: '所有欄位為必填' });
    }

    if (checkPassword !== password) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同！' });
    } else {
      User.findOne({ where: { [Op.or]: [{ account }, { email }] } })

        .then((user) => {
          if (user) {

            if (user.email === email) {
              return res.json({ status: 'error', message: 'email已被註冊' });
            } else if (user.account === account) {
              return res.json({ status: 'error', message: 'account已被註冊' });
            }
          } else {
            return User.create({
              name,
              email,
              account,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
              role: 'user',
            });
          }
        })
        .then((user) => {
          res.json({ status: 'success', message: '成功註冊帳號!' });
        })
        .catch((error) => res.send(error));
    }
  },

  signIn: (req, res) => {
    if (!req.body.account || !req.body.password) {
      return res.json({ status: 'error', message: '請填寫完整資料' });
    }

    const account = req.body.account;
    const password = req.body.password;

    User.findOne({ where: { account } })
      .then((user) => {
        if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' });
        if (user.role !== 'user') {
          return res.status(401).json({ status: 'error', message: 'Permission denied.' })
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ status: 'error', message: 'passwords did not match!' });
        }

        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        return res.json({
          status: 'success',
          message: 'ok',
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            account: user.account,
            role: user.role,
          },
        });
      })
      .catch((error) => res.send(error));
  },

  getCurrentUser: (req, res) => {
    const user = helpers.getUser(req);
    Tweet.count({ where: { UserId: helpers.getUser(req).id } })
      .then(tweets => {
        user.dataValues.tweetCount = tweets
        return res.json(user);
      })
  },

  getUser: (req, res) => {
    const id = req.params.id;
    User.findByPk(id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
    })
      .then((user) => {
        user.dataValues.isCurrentUser = Number(id) === helpers.getUser(req).id;
        user.dataValues.isFollowed = helpers.getUser(req).Followings.some((d) => d.id === Number(id));

        return res.json(user);
      })
      .catch((error) => res.send(error));
  },

  getUserTweets: (req, res) => {
    Tweet.findAll({
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Reply, include: [{ model: User, attributes: ['name', 'account', 'avatar'] }] }
        , Like],
      order: [['createdAt', 'DESC']],
      where: {
        UserId: req.params.id,
      },
    }).then((tweets) => {
      const data = tweets.map((t) => ({
        ...t.dataValues,
        description: t.dataValues.description.substring(0, 50),
        likeCount: t.Likes.length,
        ReplyCount: t.Replies.length,
        isLike: t.Likes.some(t => t.UserId === helpers.getUser(req).id)
      }));
      return res.json(data);
    })
      .catch((error) => res.send(error));
  },

  getReplyTweet: (req, res) => {
    Reply.findAll({
      include: [{
        model: Tweet,
        include: [{ model: User, attributes: { exclude: ['password'] } },
        { model: Reply, include: [{ model: User, attributes: ['name', 'account', 'avatar'] }] },
          Like]
      }],
      order: [['createdAt', 'DESC']],
      where: {
        UserId: req.params.id,
      },
    }).then((reply) => {
      const data = reply.map(r => ({
        ...r.dataValues,
        // description: r.Tweet.description.substring(0, 50),
        likeCount: r.Tweet.Likes.length,
        ReplyCount: r.Tweet.Replies.length,
        isLike: r.Tweet.Likes.some(t => t.UserId === helpers.getUser(req).id)
      }))

      return res.json(data);
    })
      .catch((error) => res.send(error));
  },

  putUser: async (req, res) => {
    try {
      if (Number(req.params.id) !== helpers.getUser(req).id) {
        return res.json({ status: 'error', message: '非已登入的使用者' });
      }


      const { account, name, email, password, checkPassword, introduction } = req.body
      const user = await User.findByPk(helpers.getUser(req).id)

      if (account !== user.account) {
        const accountCheck = await User.findOne({ where: { account: req.body.account } })
        if (accountCheck) { return res.json({ status: 'error', message: 'account已有人使用' }) }
      }


      if (email !== user.email) {
        const emailCheck = await User.findOne({ where: { email: req.body.email } })
        if (emailCheck) { return res.json({ status: 'error', message: 'email已有人使用' }) }
      }

      if (password) {
        if (password !== checkPassword) {
          return res.json({ status: 'error', message: '兩次密碼輸入不一致' });
        }
      }

      const files = req.files
      let avatar = user.avatar
      let cover = user.cover

      if (files) {
        imgur.setClientId(IMGUR_CLIENT_ID);
        avatar = files.avatar;
        cover = files.cover;

        if (avatar && cover) {
          const acatarData = await imgur.uploadFile(avatar[0].path);
          const coverData = await imgur.uploadFile(cover[0].path);
          avatar = acatarData.link;
          cover = coverData.link;
        } else if (avatar) {
          const data = await imgur.uploadFile(avatar[0].path);
          avatar = data.link;
        } else if (cover) {
          const data = await imgur.uploadFile(cover[0].path);
          cover = data.link;
        }
      }

      await User.update(
        {
          account: account || user.account,
          name: name || user.name,
          email: email || user.email,
          password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) : user.password,
          introduction: introduction || user.introduction,
          avatar: avatar || user.avatar,
          cover: cover || user.cover,
        },
        {
          where: { id: helpers.getUser(req).id },
        }
      );

      return res.json({ status: 'success', message: '資料修改成功!' });
    } catch (error) {
      console.warn(error);
    }
  },
  //回傳"使用者跟隨"的資料
  getFollowing: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followings' }],
    }).then((user) => {
      res.json(user.Followings);
    });
  },
  //回傳"跟隨使用者"的資料
  getFollower: (req, res) => {
    return User.findByPk(req.params.id, {
      include: {
        attributes: ['id', 'name', 'account', 'avatar', 'introduction'],
        model: User,
        as: 'Followers',
      },
    }).then(async (user) => {
      user = user.toJSON();
      for (follower of user.Followers) {
        await Followship.findOne({
          where: {
            followerId: req.params.id, //1 , //使用者本人
            followingId: follower.id, //3
          },
        }).then((result) => {
          if (result) {
            follower.isFollowed = 1;
          } else {
            follower.isFollowed = 0;
          }
        });
      }
      res.json(user.Followers);
    });
  },

  getLikeTweets: (req, res) => {
    Like.findAll({
      include: [{
        model: Tweet, include: [{ model: User, attributes: { exclude: ['password'] } },
        { model: Reply, include: [{ model: User, attributes: ['name', 'account', 'avatar'] }] }, Like]
      }],
      order: [['createdAt', 'DESC']],
      where: { UserId: req.params.id },
    }).then(likes => {

      const data = likes.map(d => ({
        ...d.dataValues,
        // description: d.dataValues.Tweet.dataValues.description.substring(0, 50),
        likeCount: d.Tweet.Likes.length,
        ReplyCount: d.Tweet.Replies.length,
        isLike: d.Tweet.Likes.some(t => t.UserId === helpers.getUser(req).id)
      }))
      return res.json(data)
    }).catch(error => res.send(error))

  },

  getTop10Users: (req, res) => {
    User.findAll({
      limit: 10,
      raw: true,
      nest: true,
      attributes: [
        'id',
        'name',
        'account',
        'avatar',
        [
          sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'),
          'FollowerCount',
        ],
      ],
      order: [[sequelize.literal('FollowerCount'), 'DESC']],
    })
      .then((top11Users) => {
        const user = helpers.getUser(req);
        const top10Users = top11Users.filter((top11User) => top11User.id !== user.id); //user.id
        return top10Users; //若沒濾掉則為11個 ,由前端顯示10筆
      })
      .then(async (top10Users) => {
        const user = helpers.getUser(req);
        console.log(top10Users);
        for (top10user of top10Users) {
          await Followship.findOne({
            where: {
              followerId: user.id, //user.id , //當前使用者
              followingId: top10user.id, //3
            },
          }).then((result) => {
            if (result) {
              top10user.isFollowed = 1;
            } else {
              top10user.isFollowed = 0;
            }
          });
        }
        res.json(top10Users);
      });
  },
}

module.exports = userController


