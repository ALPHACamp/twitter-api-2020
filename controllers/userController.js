const jwt = require('jsonwebtoken')
const { User, Tweet } = require('../models')
const { getUser } = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
const bcrypt = require('bcryptjs')
const userController = {
  signIn: (req, res, next) => {
    const { from } = req.query
    if (!from) {
      res
        .status(403)
        .json(
          'Pls insert ?from=back or ?from=front at urls to let me know which way you want to sign!'
        )
    }
    try {
      // if(from === 'back')
      if (req.authInfo && req.authInfo.message) { return res.status(400).json(req.authInfo.message) }
      const userData = getUser(req).toJSON()
      if (
        (userData.role === 'user' && from === 'front') ||
        (userData.role === 'admin' && from === 'back')
      ) {
        if (!userData) { return res.status(400).json('account or password incorrect!') }
        delete userData.password

        const token = jwt.sign(userData, process.env.JWT_SECRET, {
          expiresIn: '7d'
        })
        return res.status(200).json({ token, userData })
      } else {
        res
          .status(401)
          .json(
            `I'm sorry, but access to the ${from}stage area is restricted.`
          )
      }
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) { return res.status(400).json('Password do not match!') }
    if (req.body.name.length > 50) return res.status(400).json('Max length 50')
    return Promise.all([
      User.findOne({ where: { email: req.body.email } }),
      User.findOne({ where: { account: req.body.account } })
    ])
      .then(([emailCheck, accountCheck]) => {
        if (emailCheck) return res.status(400).json('Email already exists!')
        if (accountCheck) { return res.status(400).json('Account already exists!') }
        return bcrypt.hash(req.body.password, 10)
      })
      .then((hash) =>
        User.create({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
      .then((data) => {
        const userData = data.toJSON() // 需修改?
        delete userData.password // 需修改?
        res.status(200).json('Create success')
      })
      .catch((err) => next(err))
  },
  getUser: (req, res, next) => {
    const userId = req.params.id
    Promise.all([
      User.findOne({
        where: { id: userId },
        raw: true
      }),
      Tweet.findAll({
        where: { UserId: userId },
        raw: true
      })
    ])
      .then(([data, tweets]) => {
        if (!data) return res.status(404).json('User not found!')
        delete data.password
        data.tweetsCounts = tweets.length
        res.status(200).json(data)
      })
      .catch((err) => next(err))
  },
  // putUser: (req, res, next) => {
  //   // 為了做到可以&只能更新自己的資料，且如果自己的資料重複也能更新，且不能跟別人重複account、email
  //   // 下一階段再考慮優化它
  //   const userId = Number(getUser(req).dataValues.id)
  //   const paramsUserId = Number(req.params.id)
  //   // const userId = Number(req.user.id) 原本資料
  //   if (paramsUserId !== userId) return res.status(403).json('Can not change others data')
  //   const userAccount = req.user.account
  //   const userEmail = req.user.email
  //   const { account, name, email, password, passwordCheck, introduction } = req.body
  //   const { file } = req

  //   if (password !== passwordCheck) return res.status(400).json('Password do not match!')
  //   Promise.all([
  //     User.findAll({
  //       attributes: ['account', 'email']
  //     }),
  //     User.findByPk(userId),
  //     imgurFileHandler(file)
  //   ])
  //     .then(([users, userdata, filePath]) => {
  //       const accountList = []
  //       const emailList = []
  //       users.map((user) => {
  //         accountList.push(user.account)
  //         emailList.push(user.email)
  //         return users
  //       })
  //       accountList.splice(accountList.indexOf(userAccount), 1)
  //       emailList.splice(emailList.indexOf(userEmail), 1)
  //       if (accountList.includes(account)) { return res.status(400).json('This account has been used!') }
  //       if (emailList.includes(email)) { return res.status(400).json('This email has been used!') }

  //       console.log('userdata before update:', userdata.toJSON(), req.body.name)

  //       return bcrypt
  //         .hash(password, 10)
  //         .then((hash) => {
  //           return {
  //             account,
  //             name: req.body.name || userdata.name,
  //             email,
  //             avatar: filePath || null,
  //             password: hash,
  //             introduction
  //           }
  //         })
  //         .then(data => {
  //           return userdata.update(data)
  //         })
  //         .catch((err) => next(err))
  //     })
  //     .then(() => {
  //       return res.status(200).json('update success')
  //     })
  //     .catch((err) => next(err))
  // },
  putUser: async (req, res, next) => {
    try {
      const userId = Number(getUser(req).dataValues.id)
      const paramsUserId = Number(req.params.id)
      if (paramsUserId !== userId) { return res.status(403).json('Can not change others data') }

      const userAccount = req.user.account
      const userEmail = req.user.email
      const { account, name, email, password, passwordCheck, introduction } =
        req.body
      const { file } = req

      if (password !== passwordCheck) { return res.status(400).json('Password do not match!') }

      const [users, userdata, filePath] = await Promise.all([
        User.findAll({ attributes: ['account', 'email'] }),
        User.findByPk(userId),
        imgurFileHandler(file)
      ])

      const accountList = users.map((user) => user.account)
      const emailList = users.map((user) => user.email)
      accountList.splice(accountList.indexOf(userAccount), 1)
      emailList.splice(emailList.indexOf(userEmail), 1)

      if (accountList.includes(account)) {
        return res.status(400).json('This account has been used!')
      }
      if (emailList.includes(email)) {
        return res.status(400).json('This email has been used!')
      }

      let hash
      if (password) {
        hash = await bcrypt.hash(password, 10)
      }
      const data = {
        account,
        name,
        email,
        avatar: filePath || null,
        password: hash || userdata.password,
        introduction
      }
      await userdata.update(data)

      return res.status(200).json('update success')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  deleteUser: (req, res, next) => {
    const userId = req.params.id
    // 別人也能刪除自己 需更動passport
    User.findByPk(userId)
      .then((user) => {
        if (!user) return res.status(404).json('User not found')
        user.destroy()
      })
      .then(() => {
        res.status(200).json('Delete success')
      })
      .catch((err) => next(err))
  },
  getTopUsers: (req, res, next) => {
    // 研究如何把followers從res中移除，否則回傳資料太大包
    User.findAll({
      include: [
        {
          model: User,
          as: 'Followers'
        }
      ]
    })
      .then((users) => {
        const data = users
          .map((user) => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowing: req.user.Followings
              ? req.user.Followings.some((f) => f.id === user.id)
              : false
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        data.forEach((user, index) => {
          if (user.account === 'root') data.splice(index, 1)
        })
        const final = data.map(({ Followers, ...rest }) => rest)
        res.status(200).json(final)
      })
      .catch((err) => next(err))
  }
}

module.exports = userController
