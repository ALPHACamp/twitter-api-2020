/* DB */
const db = require('../../models')
const { User, Tweet, Like, Reply } = db

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
    // 檢查必要資料
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({
        status: 'error',
        message: 'Please fill both Email & Password fields!'
      })
    }
    const user = await User.findOne({ where: { email } })
    // 檢查 user 是否存在與密碼是否正確，是否為admin
    if (!user || user.role === 'admin')
      return res
        .status(401)
        .json({ status: 'error', message: 'no such user found' })
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
  },

  //註冊
  signUp: async (req, res) => {
    try {
      const { name, account, email, password, checkPassword } = req.body
      if (!name || !account || !email || !password || !checkPassword) {
        return res.json({
          status: 'error',
          message: 'Required fields must be filled！'
        })
      }
      if (checkPassword !== password) {
        return res.json({
          status: 'error',
          message: 'Passwords is not matched！'
        })
      } else {
        const user = await User.findOne({ where: { email } })
        const accountCheck = await User.findOne({ where: { account } })

        if (user) {
          return res.json({
            status: 'error',
            message: 'Email has already existed!'
          })
        }
        if (accountCheck) {
          return res.json({
            status: 'error',
            message: 'Account has already existed!'
          })
        }
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
      }
    } catch (err) {
      console.log(err)
    }
  },
  //查看使用者資料
  getUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user || user.role === 'admin') {
        return res.json({ status: 'error', message: 'No user' })
      } else {
        return res.json(user)
      }
    } catch (err) {
      console.log(err)
    }
  },
  //查看使用者推文 ****
  getTweets: async (req, res) => {
    try {
      const userTweets = await User.findByPk(req.params.id, { include: Tweet })
      return res.json(userTweets.Tweets)
    } catch (err) {
      console.log(err)
    }
  },
  //修改個人資料
  putUsers: async (req, res) => {
    try {
      // 確保只有自己能修改自己的資料
      if (helpers.getUser(req).id !== Number(req.params.id)) {
        return res.json({ status: 'error', message: '無法變更他人資料' })
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
              cover: img2.data.link
            })
          })
        })
        res.json({ status: 'success', message: '使用者資料編輯成功' })
        // 如果沒上傳圖片 update
      } else {
        const user = await await User.findByPk(req.params.id)
        await user.update({
          ...req.body,
          avatar: null,
          cover: null
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
        attributes: ['account', 'id', 'name', 'avatar',
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
}

module.exports = userController
