const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const { User, Tweet, Followship, Reply, Like } = require('../models')
const jwt = require('jsonwebtoken')
const { ReqError, AuthError, AutherError } = require('../helpers/errorInstance')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { tryCatch } = require('../helpers/tryCatch')
const { getUser } = require('../_helpers')

const userController = {
  signUp: tryCatch(async (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!email || !name || !account || !password || !checkPassword) {
      throw new ReqError('請填寫所有欄位!')
    }
    if (password !== checkPassword) throw new ReqError('密碼與確認密碼不一致!') // 確認密碼一致
    const user = await User.findOne({
      // account 和 email 不能與其他人重複
      where: {
        [Op.or]: [{ email }, { account }]
      }
    })
    if (user) {
      if (user.email === email) throw new ReqError('email 已重複註冊！')
      if (user.account === account) throw new ReqError('account 已重複註冊')
    }
    const hash = await bcrypt.hash(password, 10)
    let createdUser = await User.create({
      account,
      name,
      email,
      password: hash
    })
    createdUser = createdUser.toJSON()
    delete createdUser.password
    res.json({ status: 'success', user: createdUser })
  }),
  signIn: tryCatch((req, res) => {
    const userData = getUser(req)
    console.log(userData)
    delete userData.password
    if (userData.role === 'admin') {
      throw new ReqError('帳號不存在！')
      // return res.json({ status: 'error', message: '帳號不存在！' })
    }
    const token = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: '30d'
    })
    res.json({
      status: 'success',
      data: {
        token,
        user: userData
      }
    })
  }),
  signInFail: (err, req, res, next) => {
    err = new AuthError(req.session.messages)
    next(err)
    // return res
    //   .status(401)
    //   .send({ status: 'error', error, reason: req.session.messages })
  },
  userVerify: (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.json({ status: 'success', user: decoded })
  },
  getUser: tryCatch(async (req, res) => {
    const { id } = req.params
    const user = await User.findByPk(id, {
      raw: true
    })
    if (!user) throw new ReqError('無此使用者資料....')
    user.tweetsCounts = await Tweet.count({ where: { UserId: id } })
    user.followersCounts = await Followship.count({
      where: { followingId: id }
    })
    user.followingsCounts = await Followship.count({
      where: { followerId: id }
    })
    // 字串比數字 用==
    user.currentUser = (id == getUser(req).id)
    delete user.password
    return Promise.resolve(user).then(
      user => res.status(200).json(user)
      // res.status(200).json({ status: 'success', user })
    )
  }),
  getUserTweets: tryCatch(async (req, res) => {
    const userId = getUser(req).id
    const user = await User.findOne({ id: userId })
    if (!user) throw new ReqError('無此使用者資料')
    const followings = await Followship.findAll({
      where: { followerId: userId },
      attributes: ['followingId'],
      raw: true
    })
    // Set可以拿掉 目前種子資料難以避免重複追蹤
    const showIds = [...new Set(followings.map(e => e.followingId))]
    showIds.push(userId)
    const tweets = await Tweet.findAll({
      where: { UserId: showIds },
      include: [
        { model: User, attributes: ['name', 'account'] },
        { model: Reply },
        { model: Like }
      ],
      order: [['createdAt', 'DESC']], // or ['id', 'DESC'] 因為理論上id越後面越新
      nest: true
    })
    const result = tweets.map(e => {
      const temp = e.toJSON()
      temp.Replies = temp.Replies.length
      temp.Likes = temp.Likes.length
      return temp
    })
    return Promise.resolve(result).then(result =>
      res.status(200).json(result)
      // res.status(200).json({ status: 'success', tweets: result })
    )
  }),
  getTweets: tryCatch(async (req, res) => {
    const { id } = req.params
    const user = await User.findByPk(id)
    if (!user) throw new ReqError('無此使用者資料')
    const tweets = await Tweet.findAll({
      where: { UserId: id },
      include: [{ model: Reply }, { model: Like }],
      order: [['createdAt', 'DESC']],
      nest: true
    })
    const result = tweets.map(e => {
      const temp = e.toJSON()
      temp.Replies = temp.Replies.length
      temp.Likes = temp.Likes.length
      return temp
    })
    return Promise.resolve(result)
      .then(result =>
        res.status(200).json(result)
        // res.status(200).json({ status: 'success', tweets: result })
      )
  }),
  getReplies: tryCatch(async (req, res) => {
    // 之後或許需要使用者名稱跟帳號
    const { id } = req.params
    const user = await User.findByPk(id)
    if (!user) throw new ReqError('無此使用者資料')
    const replies = await Reply.findAll({
      where: { UserId: id },
      include: {
        model: Tweet,
        attributes: ['id'],
        include: { model: User, attributes: ['account'] }
      },
      order: [['createdAt', 'DESC']],
      raw: true
    })
    const result = replies.map(e => ({
      ...e,
      name: getUser(req).name,
      account: getUser(req).account
    }))
    return Promise.resolve(result).then(result =>
      res.status(200).json(result)
      // res.status(200).json({ status: 'success', replies: result })
    )
  }),
  getLikes: tryCatch(async (req, res) => {
    const { id } = req.params
    const user = await User.findByPk(id)
    if (!user) throw new ReqError('無此使用者資料')
    let likes = await Like.findAll({
      where: { UserId: id },
      attributes: ['id'],
      order: [['createdAt', 'DESC']],
      raw: true
    })
    likes = likes.map(e => e.id)
    let result = await Tweet.findAll({
      where: { id: likes },
      include: { model: User, attributes: ['name', 'account'] },
      raw: true
    })
    result = result.map(e => {
      delete Object.assign(e, { TweetId: e.id }).id
      return e
    })
    return Promise.resolve(result).then(result =>
      res.status(200).json(result)
      // res.status(200).json({ status: 'success', likes: result })
    )
  }),
  getFollowings: tryCatch(async (req, res) => {
    const { id } = req.params
    const followings = await User.findByPk(id, {
      include: [
        {
          model: User,
          as: 'Followings',
          attributes: ['id', 'name', 'avatar', 'introduction']
        }
      ]
    })
    if (!followings) throw new ReqError('無此使用者資料')
    // 使用者追蹤id資料，之後應該使用passport deserialize的使用者資料
    let currentUser = await User.findByPk(getUser(req).id || 2, {
      include: [{ model: User, as: 'Followings', attributes: ['id'] }],
      attributes: ['id']
    })
    currentUser = currentUser.toJSON()
    // -----------------------------------------------------
    const result = followings.toJSON().Followings.map(e => {
      e = {
        ...e,
        currentfollowed: currentUser.Followings.some(
          element => element.id === e.id
        )
      }
      delete Object.assign(e, { followingId: e.id }).id
      return e
    })
    return Promise.resolve(result).then(
      result => res.status(200).json(result)
      // res.status(200).json({ status: 'success', followings: result })
    )
  }),
  getFollowers: tryCatch(async (req, res) => {
    const { id } = req.params
    const followers = await User.findByPk(id, {
      include: [
        {
          model: User,
          as: 'Followers',
          attributes: ['id', 'name', 'avatar', 'introduction'],
          order: [['createdAt', 'DESC']]
        }
      ]
    })
    if (!followers) throw new ReqError('無此使用者資料')
    // 使用者追蹤id資料，之後應該使用passport deserialize的使用者資料
    let currentUser = await User.findByPk(getUser(req).id || 2, {
      include: [{ model: User, as: 'Followings', attributes: ['id'] }],
      attributes: ['id']
    })
    currentUser = currentUser.toJSON()
    // -----------------------------------------------------
    const result = followers.toJSON().Followers.map(e => {
      e = {
        ...e,
        currentfollowed: currentUser.Followings.some(
          element => element.id === e.id
        )
      }
      delete Object.assign(e, { followerId: e.id }).id
      return e
    })
    return Promise.resolve(result).then(result =>
      res.status(200).json(result)
      // res.status(200).json({ status: 'success', followers: result })
    )
  }),
  putUser: tryCatch(async (req, res) => {
    const { id } = req.params
    // 一個是number 一個是string 所以使用不嚴格的!=
    // !!下面是為了測試檔
    // if (getUser(req).id != req.params.id) throw new AutherError('無法編輯他人資料')
    const form = req.body
    const finalform = await userController.formValidation(form, req)
    const user = await User.findByPk(id)
    let result = await user.update(finalform)
    result = result.toJSON()
    delete result.password
    return Promise.resolve(result).then(result =>
      res.status(200).json(result)
      // res.status(200).json({ status: 'success', updatedUser: result })
    )
  }),
  formValidation: async (form, req) => {
    const finalform = {}
    for (const key in form) {
      if (key === 'password') {
        form[key] = bcrypt.hashSync(form[key], bcrypt.genSaltSync(10), null)
      }
      if (key === 'email') {
        if (!form[key]) throw new ReqError('此信箱不可為空')
        const countEmail = await User.findAndCountAll({
          where: { email: form[key], id: { [Op.notIn]: [getUser(req).id] } }
        })
        if (countEmail.count) throw new ReqError('此信箱已被使用')
      }
      if (key === 'account') {
        if (!form[key]) throw new ReqError('此帳號不可為空')
        const countAccount = await User.findAndCountAll({
          where: {
            account: form[key],
            id: { [Op.notIn]: [getUser(req).id] }
          }
        })
        if (countAccount.count) throw new ReqError('此帳號已被使用')
      }
      // 前端表格如果沒放檔案avatar, background會還傳空字串而不會出現在req.files
      if (key !== 'avatar' && key !== 'background') {
        finalform[key] = form[key]
      }
    }
    // 有表格而未上傳 req.files.name 是 undefind
    const files = req.files

    if (files) {
      if (files.avatar) {
        const avatarURL = await imgurFileHandler(files.avatar[0])
        finalform.avatar = avatarURL || getUser(req).avatar
      }
      if (files.background) {
        const backgroundURL = await imgurFileHandler(files.background[0])
        finalform.background = backgroundURL || getUser(req).background
      }
    }
    return finalform
  }
}
module.exports = userController
