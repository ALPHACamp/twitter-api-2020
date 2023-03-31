const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Op, Model } = require('sequelize')
const sequelize = require('sequelize')
const { ReqError, AuthError, AutherError } = require('../helpers/errorInstance')
const { User, Tweet, Followship, Reply, Like } = require('../models')
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
    delete createdUser.updatedAt
    delete createdUser.createdAt
    res.status(200).json(createdUser)
  }),
  signIn: tryCatch((req, res) => {
    const userData = getUser(req).toJSON()
    delete userData.password
    delete userData.updatedAt
    delete userData.createdAt
    if (userData.role === 'admin') {
      throw new ReqError('帳號不存在！')
      // return res.json({ status: 'error', message: '帳號不存在！' })
    }
    const token = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: '30d'
    })
    res.status(200).json({
      data: {
        token,
        user: userData
      }
    })
  }),
  signInFail: (err, req, res, next) => {
    if (err instanceof ReqError) return next(err)
    err = new AuthError(req.session.messages)
    next(err)
  },
  userVerify: tryCatch(async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.id)
    delete user.updatedAt
    delete user.createdAt
    res.status(200).json(user)
  }),
  getUser: tryCatch(async (req, res) => {
    const userData = getUser(req) instanceof Model
      ? getUser(req).toJSON()
      : getUser(req).dataValues
    const { id } = req.params
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password', 'updatedAt', 'createdAt'] },
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
    user.currentUser = id == userData.id
    user.currentfollowed = userData.Followings.some(userF => userF.id === Number(id))
    return Promise.resolve(user).then(
      user => res.status(200).json(user)
      // res.status(200).json({ status: 'success', user })
    )
  }),
  getTweets: tryCatch(async (req, res) => {
    const { id } = req.params
    const currentUser = getUser(req)
    const user = await User.findByPk(id, { raw: true })
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
      temp.currentIsLiked = currentUser.Likes?.some(like => like.TweetId === e.id)
      temp.avatar = user.avatar
      return temp
    })
    return Promise.resolve(result)
      .then(result =>
        res.status(200).json(result)
        // res.status(200).json({ status: 'success', tweets: result })
      )
  }),
  getReplies: tryCatch(async (req, res) => {
    const userData = getUser(req) instanceof Model
      ? getUser(req).toJSON()
      : getUser(req).dataValues
    // 之後或許需要使用者名稱跟帳號
    const { id } = req.params
    const user = await User.findByPk(id, { raw: true })
    if (!user) throw new ReqError('無此使用者資料')
    const replies = await Reply.findAll({
      where: { UserId: id },
      include: {
        model: Tweet,
        attributes: ['id'],
        include: { model: User, as: 'poster', attributes: ['id', 'account'] }
      },
      order: [['createdAt', 'DESC']],
      nest: true
    })
    const result = replies.map(e => ({
      ...e.toJSON(),
      name: userData.name,
      account: userData.account,
      avatar: user.avatar
    }))
    return Promise.resolve(result).then(result =>
      res.status(200).json(result)
      // res.status(200).json({ status: 'success', replies: result })
    )
  }),
  getLikes: tryCatch(async (req, res) => { // 可優化 將SQL語法轉為Squelize
    const { id } = req.params
    const user = await User.findByPk(id)
    const currentUser = getUser(req).dataValues
    if (!user) throw new ReqError('無此使用者資料')
    let likes = await Like.findAll({
      where: { UserId: id },
      attributes: ['TweetId'],
      order: [['updatedAt', 'DESC']],
      raw: true
    })
    likes = likes.map(e => e.TweetId)
    let result = await Tweet.findAll({
      where: { id: likes },
      attributes: [
        'id', 'description', 'image', 'createdAt', 'updatedAt',
        [sequelize.literal('(SELECT COUNT(*) FROM `Likes` WHERE `Likes`.`Tweet_id` = `Tweet`.`id` AND `Likes`.`deleted_at` IS NULL)'), 'Likes'],
        [sequelize.literal('(SELECT COUNT(*) FROM `Replies` WHERE `Replies`.`Tweet_id` = `Tweet`.`id`)'), 'Replies']
      ],
      include: [
        { model: User, as: 'poster', attributes: ['id', 'name', 'account', 'avatar', 'updatedAt'] }
      ],
      nest: true,
      raw: true,
      order: [['updatedAt', 'DESC']]
    })
    result = result.map(LikedPost => {
      delete Object.assign(LikedPost, { TweetId: LikedPost.id }).id
      LikedPost.currentIsLiked = currentUser.Likes?.some(lu => {
        return lu.TweetId === LikedPost.TweetId
      })
      return LikedPost
    })
    return Promise.resolve(result).then(result =>
      res.status(200).json(result)
      // res.status(200).json({ status: 'success', likes: result })
    )
  }),
  getFollowings: tryCatch(async (req, res) => {
    const userData = !(getUser(req) instanceof Model)
      ? getUser(req).dataValues
      : getUser(req).toJSON()
    const { id } = req.params
    const followings = await User.findByPk(id, {
      include: [
        {
          model: User,
          as: 'Followings',
          attributes: ['id', 'name', 'avatar', 'introduction'],
          order: [['updatedAt', 'DESC']]
        }
      ]
    })
    if (!followings) throw new ReqError('無此使用者資料')
    const result = followings.toJSON().Followings.map(e => {
      e = { ...e }
      delete Object.assign(e, { followingId: e.id }).id
      e.currentfollowed = userData.Followings
        ? userData.Followings.some(element => element.id === e.followingId)
        : false
      delete e.Followship
      return e
    })
    return Promise.resolve(result).then(
      result => res.status(200).json(result)
      // res.status(200).json({ status: 'success', followings: result })
    )
  }),
  getFollowers: tryCatch(async (req, res) => {
    const userData = !(getUser(req) instanceof Model)
      ? getUser(req).dataValues
      : getUser(req).toJSON()
    const { id } = req.params
    const followers = await User.findByPk(id, {
      include: [
        {
          model: User,
          as: 'Followers',
          attributes: ['id', 'name', 'avatar', 'introduction'],
          order: [['updatedAt', 'DESC']]
        }
      ]
    })
    if (!followers) throw new ReqError('無此使用者資料')
    const result = followers.toJSON().Followers.map(e => {
      e = { ...e }
      delete Object.assign(e, { followerId: e.id }).id
      e.currentfollowed = userData.Followings
        ? userData.Followings.some(
          element => element.id === e.followerId
        )
        : false
      delete e.Followship
      return e
    })
    return Promise.resolve(result).then(result =>
      res.status(200).json(result)
      // res.status(200).json({ status: 'success', followers: result })
    )
  }),
  putUser: tryCatch(async (req, res) => {
    const userData = getUser(req) instanceof Model
      ? getUser(req).toJSON()
      : getUser(req).dataValues
    const { id } = req.params
    // 一個是number 一個是string 所以使用不嚴格的!=
    if (userData.id != id) throw new AutherError('無法編輯他人資料')

    const form = req.body
    const finalform = await userController.formValidation(form, req)
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password', 'updatedAt', 'createdAt'] }
    })
    let result = await user.update(finalform)
    result = result.toJSON()
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
