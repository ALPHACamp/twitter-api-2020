const jwt = require('jsonwebtoken')
const { User, Tweet } = require('../models')
const bcrypt = require('bcryptjs')

const userServices = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.checkPassword) {
      throw new Error('密碼不一致 !')
    }

    const { account, name, email, password } = req.body

    if (name.length > 50) throw new Error('字數超出上限！')

    return Promise.all([
      User.findOne({ where: { account }, raw: true }),
      User.findOne({ where: { email }, raw: true })
    ])
      .then(([userAccount, userEmail]) => {
        // account 和 email 都未重複，建立資料
        if (!userAccount && !userEmail) {
          return User.create({
            account,
            name,
            email,
            password: bcrypt.hashSync(password, 10)
          })
        }

        // account 或是 email 未重複
        if (!userAccount || !userEmail) {
          //  account 重複
          if (!userEmail) throw new Error('account 已重複註冊！')
          //  email 重複
          if (!userAccount) {
            throw new Error('email 已重複註冊！')
          }
        }
        // 重複 account
        if (userAccount.account === account) {
          throw new Error('account 已重複註冊！')
        }
        // 重複 email
        if (userEmail.email === email) throw new Error('email 已重複註冊！')
      })

      .then(() => cb(null, { success: 'true' }))
      .catch((err) => cb(err))
  }
}

const userController = {
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => (err ? next(err) : res.json(data)))
  },
  signIn: (req, res, next) => {
    const { account, password } = req.body
    if (!account || !password) {
      throw new Error('account and password are required.')
    }

    User.findOne({ where: { account }, raw: true })
      .then((user) => {
        if (!user) {
          throw new Error('帳號不存在！')
        }
        const isValidPassword = bcrypt.compareSync(password, user.password)

        if (!isValidPassword) {
          throw new Error('帳號不存在！')
        }

        const UserId = { id: user.id }
        const token = jwt.sign(UserId, process.env.JWT_SECRET, {
          expiresIn: '30d'
        })

        delete user.password
        return res.status(200).json({ success: true, token, user })
      })
      .catch((err) => next(err))
  },
  getUser: (req, res, next) => {
    const { id } = req.params
    User.findByPk(id, {
      include: [
        Tweet,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })
      .then((user) => {
        if (!user) throw new Error('使用者不存在 !')
        // 使用者推文數
        const tweetCount = user.Tweets.length
        // 使用者追蹤數
        const followingCount = user.Followings.length
        // 使用者被追蹤數
        const follwerCount = user.Followers.length
        // 使用者與登入者追蹤關係
        const isFollwerd = user.Followers.some(
          (follower) => follower.followingId === user.id
        )
        user = user.toJSON()
        // 刪除非必要屬性
        delete user.Tweets
        delete user.Followings
        delete user.Followers
        delete user.password
        // 新增屬性
        user.tweetCount = tweetCount
        user.followingCount = followingCount
        user.follwerCount = follwerCount
        user.isFollwerd = isFollwerd

        return res.status(200).send(user)
      })
      .catch((err) => next(err))
  },
  putUser: (req, res, next) => {
    const { account, name, email, introduction } = req.body
    const { id } = req.params

    let avatarFile = req.files.avatar
    let coverFile = req.files.cover
    if (!name) throw new Error('name 欄位為必填!')
    // 將 avatar 和 cover 資料取出

    if (!req.files.avatar) {
      avatarFile = [{ path: '' }]
    }

    if (!req.files.cover) {
      coverFile = [{ path: '' }]
    }

    return Promise.all([User.findByPk(id), avatarFile, coverFile])
      .then(([user, avatarFile, coverFile]) => {
        if (!user) throw new Error('使用者不存在!')

        return user.update({
          account,
          name,
          email,
          introduction,
          avatar: avatarFile[0].path || user.avatar,
          cover: coverFile[0].path || user.cover
        })
      })
      .then((updateUser) =>
        res.status(201).json({ success: true, data: updateUser })
      )
      .catch((err) => next(err))
  }
}

module.exports = userController
