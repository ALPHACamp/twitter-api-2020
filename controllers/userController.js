const bcrypt = require('bcryptjs')
const { User, Like, Tweet, Reply } = require('../models')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  //signIn & signUp
  signIn: (req, res) => {
    const { account, password } = req.body
    if (!account || !password) {
      return res.json({
        status: 'error',
        message: "required fields didn't exist",
      })
    }

    User.findOne({ where: { account } }).then((user) => {
      if (!user)
        return res
          .status(401)
          .json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(401)
          .json({ status: 'error', message: 'passwords did not match' })
      }
      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user,
      })
    })
  },

  signUp: async (req, res) => {
    try {
      // confirm password
      if (req.body.checkPassword !== req.body.password) {
        return res
          .status(401)
          .json({ status: 'error', message: ' 兩次密碼不相同' })
      } else {
        // confirm unique user
        const email = await User.findOne({ where: { email: req.body.email } })
        const account = await User.findOne({
          where: { account: req.body.account },
        })
        if (email || account) {
          return res.status(401).json({
            status: 'error',
            message: '此信箱或帳號已註冊過！',
          })
        } else {
          const user = await User.create({
            account: req.body.account,
            name: req.body.name,
            email: req.body.email,
            role: 'user',
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10)
            ),
          })
          return res
            .status(200)

            .json({
              status: 'success',
              message: '成功註冊帳號！',
              user: { id: user.id, email: user.email, account: user.account },
            })
        }
      }
    } catch (error) {
      console.log(error)
    }
  },

  //user
  getUser: async (req, res) => {
    try {
      const user = (
        await User.findByPk(req.params.id, {
          attributes: [
            'id',
            'account',
            'name',
            'email',
            'avatar',
            'cover',
            'introduction',
          ],
        })
      ).toJSON()
      return res.status(200).json({
        status: 'success',
        message: 'ok',
        ...user,
      })
    } catch (error) {
      console.log(error)
      return res
        .status(500)
        .json({ status: 'error', message: 'service error!' })
    }
  },

  putUser: async (req, res) => {
    const { account, name, email, password } = req.body
    try {
      //只有自己能編輯自己的資料
      //防止使用網址修改id切換使用者去修改別人的Profile
      if (helpers.getUser(req).id !== Number(req.params.id)) {
        return res.status(401).json({
          status: 'error',
          message: '無法變更其他使用者的Profile',
        })
      }
      const { files } = req
      if (files) {
        imgur.setClientId(IMGUR_CLIENT_ID)
        if (files.avatar) {
          // 如果有上傳avatar，直接上傳到imgur
          const avatar = await imgur.uploadFile(files.avatar[0].path)
          req.body.avatar = avatar.link
        }
        if (files.cover) {
          // 如果有上傳cover，直接上傳到imgur
          const cover = await imgur.uploadFile(files.cover[0].path)
          req.body.cover = cover.link
        }
      }
      if (password) {
        await User.update(
          {
            ...req.body,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10)
            ),
          },
          { where: { id: helpers.getUser(req).id } }
        )
        return res.status(200).json({
          status: 'success',
          message: '已成功更新！',
        })
      } else {
        await User.update(
          { ...req.body },
          { where: { id: helpers.getUser(req).id } }
        )
        return res.status(200).json({
          status: 'success',
          message: '已成功更新！',
        })
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ status: 'error', message: 'service error!' })
    }
  },
  getUsersTweets: async (req, res) => {
    try {
      const userTweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Like },
          { model: Reply },
        ],
        order: [['createdAt', 'DESC']],
      })

      let results = userTweets.map((userTweets) => ({
        tweetsId: userTweets.dataValues.id,
        description: userTweets.dataValues.description,
        createdAt: userTweets.dataValues.createdAt,
        User:userTweets.dataValues.User,
        likeCounts: userTweets.dataValues.Likes.length,
        replyCounts: userTweets.dataValues.Replies.length,
        isLike: helpers.getUser(req).Likes
          ? helpers
              .getUser(req)
              .Likes.some((like) => like.TweetId === userTweets.dataValues.id)
          : false,
      }))
      return res.status(200).json(results)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: 'Server error' })
    }
  },
}

module.exports = userController
