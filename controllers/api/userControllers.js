
const bcrypt = require('bcryptjs')
const helpers = require('../../_helpers')
const { User, Followship, Tweet, Reply, Like } = require('../../models')
const Op = require('sequelize').Op
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID



// JWT
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
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
    return res.json(user);
  },

  getUser: (req, res) => {
    const id = req.params.id
    User.findByPk(id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then((user) => {
      user.dataValues.isCurrentUser = Number(id) === helpers.getUser(req).id
      user.dataValues.isFollowed = helpers.getUser(req).Followings.some(d => d.id === Number(id))

      return res.json(user);
    })
      .catch((error) => res.send(error));
  },

  getUserTweets: (req, res) => {
    Tweet.findAll({
      include: [User],
      order: [['createdAt', 'DESC']],
      where: {
        UserId: req.params.id,
      },
    })
      .then((tweets) => {
        const data = tweets.map((t) => ({
          ...t.dataValues,
        }));
        return res.json(data);
      })
      .catch((error) => res.send(error));
  },

  getReplyTweet: (req, res) => {
    Reply.findAll({
      include: [{ model: Tweet, include: [User, Reply, Like] }],

      order: [['createdAt', 'DESC']],
      where: {
        UserId: req.params.id,
      },
    }).then((reply) => {

      const data = reply.map(r => ({
        ...r.dataValues,
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
      // const accountCheck = await User.findOne({ where: { account: req.body.account } })
      const reconfirm = await User.findOne({ where: { [Op.or]: [{ account }, { email }] } })

      const files = req.files
      let avatar = user.avatar
      let cover = user.cover


      if (reconfirm) {
        if (reconfirm.email === email) {
          return res.json({ status: 'error', message: 'email已有人使用' });
        } else if (reconfirm.account === account) {
          return res.json({ status: 'error', message: 'account已有人使用' });
        }
      }


      if (password) {
        if (password !== checkPassword) {
          return res.json({ status: 'error', message: '兩次密碼輸入不一致' });
        }
      }

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
  //回傳"使用者跟隨"的人數,ID
  getFollowing: (req, res) => {
    return Followship.findAndCountAll({
      raw: true,
      nest: true,
      where: {
        followerId: req.params.id,
      },
    }).then((results) => {
      //result.count  //result.rows
      res.json(results.rows); //, status: 'success', message: 'find following'
    });
  },
  //回傳"跟隨使用者"的人數,ID
  getFollower: (req, res) => {
    return Followship.findAndCountAll({
      raw: true,
      nest: true,
      where: {
        followingId: req.params.id,
      },
    }).then((results) => {
      //result.count  //result.rows
      res.json(results.rows); //, status: 'success', message: 'find follower'
    });
  },

  getLikeTweets: (req, res) => {
    Like.findAll({
      include: [{ model: Tweet, include: [User, Reply, Like] }],
      order: [['createdAt', 'DESC']],
      where: { UserId: req.params.id }
    }).then(likes => {
      const data = likes.map(d => ({
        ...d.dataValues,
        likeCount: d.Tweet.Likes.length,
        ReplyCount: d.Tweet.Replies.length,
        isLike: d.Tweet.Likes.some(t => t.UserId === helpers.getUser(req).id)
      }))

      return res.json(data)
    }).catch(error => res.send(error))
  }
}

module.exports = userController



