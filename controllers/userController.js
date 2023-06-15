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
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) { return res.status(400).json('Password do not match!') }
    if (name.length > 50) return res.status(400).json('Max length 50')
    return Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([emailCheck, accountCheck]) => {
        if (emailCheck) return res.status(400).json('Email already exists!')
        if (accountCheck) { return res.status(400).json('Account already exists!') }
        return bcrypt.hash(password, 10)
      })
      .then((hash) =>
        User.create({
          account,
          name,
          email,
          password: hash,
          role: 'user'
        })
      )
      .then(() => {
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
        data.isFollowing = req.user.Followings
          ? req.user.Followings.some((f) => Number(f.id) === Number(userId))
          : false
        res.status(200).json(data)
      })
      .catch((err) => next(err))
  },
  putUser: async (req, res, next) => {
    try {
      const userId = Number(req.user.id) || Number(getUser(req).dataValues?.id)
      const paramsUserId = Number(req.params.id)
      if (paramsUserId !== userId) {
        return res.status(403).json('Can not change others data')
      }
      let fileData = null
      if (req.files) {
        const { avatar, coverPhoto } = req.files
        let avatarPath, coverPhotoPath
        if (avatar) avatarPath = await imgurFileHandler(avatar[0])
        if (coverPhoto) coverPhotoPath = await imgurFileHandler(coverPhoto[0])
        fileData = {
          avatar: avatarPath,
          coverPhoto: coverPhotoPath
        }
      }
      if (Object.keys(req.query).length !== 0) {
        const { avatar, coverPhoto } = req.query
        let avatarPath, coverPhotoPath
        if (avatar) avatarPath = null
        if (coverPhoto) coverPhotoPath = null
        fileData = {
          avatar: avatarPath,
          coverPhoto: coverPhotoPath
        }
      }
      const userAccount = req.user.account
      const userEmail = req.user.email
      const { account, name, email, password, checkPassword, introduction } =
        req.body
      // 目標是req中要有兩個file 在取得時做拆分，再各自讓imgur helper上傳
      // 如何成功抓兩張圖片，multer定義的file代表單張，會回傳單一物件，files為兩張(或以上)，回傳 array
      if (name?.length > 50) return res.status(400).json('max length 50')
      if (introduction?.length > 160) return res.status(400).json('max length 160')
      if (password !== checkPassword) {
        return res.status(400).json('Password do not match!')
      }
      // 能不能用findall直接去找user的account跟email，如果找到的話跟req.user比對，成功就保留，失敗則回傳重複?
      const [users, userdata] = await Promise.all([
        User.findAll({ attributes: ['account', 'email'] }),
        User.findByPk(userId)
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
        introduction,
        email,
        password: hash || userdata.password,
        ...fileData
      }
      await userdata.update(data)
      // end around
      return res.status(200).json('update success')
    } catch (err) {
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
