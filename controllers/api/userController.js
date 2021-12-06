/* DB */
const db = require('../../models')
const { User, Tweet, Like, Reply, Followship } = db

/* necessary package */
const bcrypt = require('bcryptjs')
const IMGUR_CLIENT_ID = 'e34bbea295f4825'
const imgur = require('imgur-node-api')
// sequelize
const sequelize = require('sequelize')
const { Op } = require("sequelize")

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

//helpers
const helpers = require('../../_helpers')

let userController = {
  //登入
  signIn: async (req, res) => {
    try {
      // 檢查必要資料
      const { account, password } = req.body
      if (!account || !password) {
        return res.json({
          status: 'error',
          message: 'Please fill both Account & Password fields!'
        })
      }
      const user = await User.findOne({ where: { account } })
      // 檢查 user 是否存在與
      if (!user)
        return res
          .status(401)
          .json({ status: 'error', message: 'no such user found' })
      // 是否為admin
      if (user.role === 'admin')
        return res
          .status(401)
          .json({ status: 'error', message: 'admin can not enter front desk' })
      // 密碼是否正確
      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(401)
          .json({ status: 'error', message: 'passwords did not match' })
      }
      // 簽發 token
      var payload = { id: user.id }
      var token = jwt.sign(payload, 'alphacamp')
      return res.json({
        status: 'success',
        message: 'Login successfully!',
        token,
        user
      })
    } catch (err) {
      console.log(err)
    }
  },
  //註冊
  signUp: async (req, res) => {
    try {
      // 資料不可為空白
      const { name, account, email, password, checkPassword } = req.body
      if (!name || !account || !email || !password || !checkPassword) {
        return res.json({
          status: 'error',
          message: 'Required fields must be filled！'
        })
      }
      // 確認checkPassword、password相同
      if (checkPassword !== password) {
        return res.json({
          status: 'error',
          message: 'Passwords is not matched！'
        })
      }
      // 確認Email無重複
      const user = await User.findOne({ where: { email } })
      if (user) {
        return res.json({
          status: 'error',
          message: 'Email has already existed!'
        })
      }
      // 確認Account無重複
      const accountCheck = await User.findOne({ where: { account } })
      if (accountCheck) {
        return res.json({
          status: 'error',
          message: 'Account has already existed!'
        })
      }
      if (account.length > 20 || name.length > 50 || password.length > 20) {
        return res.json({ status: 'error', message: 'Exceeds the character limit' })
      }
      // 建立user
      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10),
          null
        ),
        role: 'user'
      })
      return res
        .status(200)
        .json({ status: 'success', message: 'Successfully register!' })

    } catch (err) {
      console.log(err)
    }
  },
  //查看使用者資料
  getUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: [['id', 'UserId'], 'avatar', 'account', 'name', 'cover', 'introduction', 'role',
        [
          sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'),
          'TweetCount'
        ],
        [
          sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'),
          'FollowingsCount'
        ],
        [
          sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'),
          'FollowersCount'
        ],
        [
          sequelize.literal(`EXISTS (SELECT * FROM Followships WHERE Followships.followerId =${helpers.getUser(req).id}  AND Followships.followingId = User.id )`),
          'isFollowed'
        ]
        ],
      })
      if (!user) {
        return res.json({ status: 'error', message: 'no such user found' })
      } else if (user.role === 'admin') {
        return res.json({ status: 'error', message: 'can not lookup admin' })
      } else {
        return res.json(user)
      }
    } catch (err) {
      console.log(err)
    }
  },
  //查看使用者推文 (抓followers)
  getTweets: async (req, res) => {
    try {
      const tweet = await Tweet.findAll({
        where: { UserId: req.params.id },
        attributes: ['description', 'UserId', 'id', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'),
            'likeCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal(`EXISTS (SELECT * FROM Likes WHERE UserId = ${helpers.getUser(req).id} AND TweetId = Tweet.id)`),
            'isLiked'],
        ],
        include: [{ model: User, attributes: ['id'] }],
        order: [['createdAt', 'DESC']],
      })
      console.log(JSON.stringify(tweet, null, 2))
      return res.json(tweet)
    } catch (err) {
      console.log(err)
    }
  },
  //修改個人資料
  putUsers: async (req, res) => {
    try {
      // 資料不可為空白
      const { name, account, email, password } = req.body
      if (!name || !account || !email || !password) {
        return res.json({
          status: 'error',
          message: 'Required fields must be filled！'
        })
      }
      // 確保只有自己能修改自己的資料
      if (helpers.getUser(req).id !== Number(req.params.id)) {
        return res.json({ status: 'error', message: 'cannot edit other user data' })
      }
      // 確認Email無重複(但可以維持原有email)
      const user = await User.findOne({
        where: {
          email,
          [Op.not]: { id: helpers.getUser(req).id }
        }
      })
      if (user) {
        return res.json({
          status: 'error',
          message: 'Email has already existed!'
        })
      }
      // 確認Account無重複
      const accountCheck = await User.findOne({ where: { account } })
      if (accountCheck) {
        return res.json({
          status: 'error',
          message: 'Account has already existed!'
        })
      }
      // 如果有上傳圖片 update
      const { files } = req
      if (files) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(files.avatar[0].path, (err, img1) => {
          imgur.upload(files.cover[0].path, async (err, img2) => {
            const user = await User.findByPk(req.params.id)
            await user.update({
              ...req.body,
              avatar: img1.data.link,
              cover: img2.data.link,
              password: bcrypt.hashSync(
                req.body.password,
                bcrypt.genSaltSync(10),
                null
              ),
            })
          })
        })
        res.json({ status: 'success', message: '使用者資料編輯成功' })
        // 如果沒上傳圖片 update
      } else {
        const user = await User.findByPk(req.params.id)
        await user.update({
          ...req.body,
          avatar: user.avatar || null,
          cover: user.cover || null,
          password: bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10),
            null
          ),
        })
        res.json({ status: 'success', message: '使用者資料編輯成功' })
      }
    } catch (err) {
      console.log(err)
    }
  },

  //跟隨者 (followers) 數量排列前 10 的使用者推薦名單
  getTop: async (req, res) => {
    try {
      const Top = await User.findAll({
        attributes: ['account', 'id', 'name', 'avatar', 'role',
          [
            sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'),
            'FollowingsCount'
          ],
          [
            sequelize.literal(`EXISTS (SELECT * FROM Followships WHERE Followships.followerId =${helpers.getUser(req).id}  AND Followships.followingId = User.id )`),
            'isFollowed'
          ]
        ],
        order: [[sequelize.literal('FollowingsCount'), 'DESC']],
        limit: 10
      })
      // console.log(JSON.stringify(Top, null, 2))
      return res.json(Top)
    } catch (err) {
      console.log(err)
    }
  },
  //找追蹤中的用戶
  getFollowings: async (req, res) => {
    try {
      const followings = await User.findAll({
        where: { id: req.params.id },
        attributes: ['account'],
        include: [
          {
            model: User, as: 'Followings',
            attributes: [['id', 'followingId'], 'account', [sequelize.literal('EXISTS (SELECT * FROM Followships WHERE Followships.followerId = User.id)'),
              'isFollowed'
            ]]
          }
        ],
        order: [[sequelize.literal('Followers.createdAt'), 'DESC']],
      })
      return res.json(followings[0].Followings)
    } catch (err) {
      console.log(err)
    }
  },
  //找追蹤自己的用戶
  getFollowers: async (req, res) => {
    try {
      const followers = await User.findAll({
        where: { id: req.params.id },
        attributes: ['account'],
        include: [{
          model: User, as: 'Followers',
          attributes: [['id', 'followerId'], 'account', [sequelize.literal('EXISTS (SELECT * FROM Followships WHERE Followships.followingId = User.id)'),
            'isFollowed'
          ]]
        }],
        order: [[sequelize.literal('Followers.createdAt'), 'DESC']],
      })
      return res.json(followers[0].Followers) //followers[0].Followers
    } catch (err) {
      console.log(err)
    }
  },

  //找Likes自己的用戶
  getLikes: async (req, res) => {
    const like = await Like.findAll({
      where: { UserId: req.params.id },
      include: [
        {
          model: Tweet, include: [User, Reply,],
          attributes: ['id', 'UserId', 'description', 'createdAt', 'updatedAt',
            [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'),
              'likeCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'),
              'replyCount'
            ],
            [sequelize.literal(`EXISTS (SELECT * FROM Likes WHERE UserId = ${req.params.id} AND TweetId = Tweet.id)`),
              'isLiked'
            ],
          ]
        }
      ]
    })
    return res.json(like)
  },
  //找自己的Replies
  getReplies: async (req, res) => {
    const replies = await Reply.findAll({
      where: { UserId: req.params.id },
      attributes: [['id', 'ReplyID'], 'comment', 'createdAt'],
      include: [
        { model: User, attributes: ['id', 'name', 'account'] },
        { model: Tweet, attributes: ['id'], include: [{ model: User, attributes: ['id', 'account', 'avatar'] }] }
      ],
      order: [['createdAt', 'DESC']],
    })
    return res.json(replies)
  },
}


module.exports = userController
