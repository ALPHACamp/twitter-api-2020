const sequelize = require('sequelize')
const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Tweet, Like, Reply } = require('../models')

const user2Controller = {
  getUserTweets: (req, res, next) => {
    const currentUserId = helpers.getUser(req)?.id // 正在使用網站的使用者id
    const UserId = Number(req.params.id) // 要查看的特定使用者id

    // 要撈特定使用者資料/tweet資料、現在使用者的like資料
    return Promise.all([
      User.findByPk(UserId),
      Tweet.findAll({
        where: { UserId },
        attributes: [
          'id', 'description', 'createdAt',
          [
            sequelize.literal('(SELECT COUNT(*) FROM Replies AS replyCount WHERE tweet_id = Tweet.id)'), 'replyCount'
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM Likes AS likeCount WHERE tweet_id = Tweet.id)'), 'likeCount'
          ]
        ],
        order: [['createdAt', 'DESC']],
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        raw: true,
        nest: true
      }),
      Like.findAll({ where: { UserId: currentUserId }, raw: true })
    ])
      .then(([user, tweets, likes]) => {
        if (!user) throw new Error("User didn't exist")
        // console.log(likes)
        // console.log(tweets)
        const userData = tweets.map(tweet => ({
          ...tweet,
          isLiked: likes.some(like => like.TweetId === tweet.id && currentUserId === like.UserId)
        }))
        res.status(200).json(userData)
      })
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    // const currentUserId = helpers.getUser(req)?.id // 正在使用網站的使用者id
    const UserId = Number(req.params.id) // 要查看的特定使用者id

    // 要撈特定使用者資料/reply資料
    return Promise.all([
      User.findByPk(UserId),
      Reply.findAll({
        where: { UserId },
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
          { model: Tweet, attributes: ['id'], include: [{ model: User, attributes: ['id', 'account'] }] }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
    ])
      .then(([user, replies]) => {
        if (!user) throw new Error("User didn't exist")
        res.status(200).json(replies)
      })
      .catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {
    const currentUserId = helpers.getUser(req)?.id // 正在使用網站的使用者id
    const UserId = Number(req.params.id) // 要查看的特定使用者id

    // 要撈特定使用者資料/特定使用者like的資料/現在使用者like的資料(要判斷現在使用者是否like)
    return Promise.all([
      User.findByPk(UserId),
      Like.findAll({
        where: { UserId },
        attributes: ['id', 'TweetId', 'createdAt'],
        include: [{
          model: Tweet,
          attributes: ['id', 'description', 'createdAt',
            [
              sequelize.literal('(SELECT COUNT(*) FROM Replies AS replyCount WHERE tweet_id = Tweet.id)'), 'replyCount' // 回傳留言數
            ],
            [
              sequelize.literal('(SELECT COUNT(*) FROM Likes AS likeCount WHERE tweet_id = Tweet.id)'), 'likeCount' // 回傳按讚數
            ]],
          include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }]
        }],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      }),
      Like.findAll({ where: { UserId: currentUserId }, raw: true })
    ])
      .then(([user, likes, currentUserlikes]) => {
        if (!user) throw new Error("User didn't exist")
        const currentUserlikeList = currentUserlikes.map(like => like.TweetId)
        const data = likes.map(like => ({
          ...like,
          isLiked: currentUserlikeList.some(TweetId => TweetId === like.TweetId)
        }))
        res.status(200).json(data)
      })
      .catch(err => next(err))
  },
  putUser: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req)?.id
      const id = Number(req.params.id)
      let { account, name, email, password, checkPassword, introduction } = req.body
      const { files } = req
      console.log('files:', files) // **********確認前端送來的req，之後記得刪掉
      console.log('typeof files:', typeof files) // **********確認前端送來的req，之後記得刪掉
      // 錯誤驗證
      if (id !== currentUserId) return res.status(400).json({ success: false, message: 'permission denied' }) // 不可編輯別人的檔案
      if (password !== checkPassword) throw new Error('password and checkPassword do not match') // 密碼不相符
      if (name?.length > 50) throw new Error('name is limited to 50 characters') // 名字太長
      if (introduction?.length > 160) throw new Error('introduction is limited to 160 characters') // 自介太長

      const user = await User.findByPk(id)

      account = account?.trim()
      name = name?.trim()
      email = email?.trim()
      password = password?.trim()
      checkPassword = checkPassword?.trim()

      // 檢查資料庫有沒有使用者想要更新的account & email，若有則不可使用該account & email
      if (account) {
        if (account !== user.account) {
          const accountExist = await User.findOne({ where: { account } })
          if (accountExist) return res.status(401).json({ success: false, message: 'account 已重複註冊！' })
        }
      }
      if (email) {
        if (email !== user.email) {
          const emailExist = await User.findOne({ where: { email } })
          if (emailExist) return res.status(401).json({ success: false, message: 'email 已重複註冊！' })
        }
      }

      // 使用者帳號資料更新
      const updateUser = await user.update({
        account: account || user.account,
        name: name || user.name,
        email: email || user.email,
        password: password ? bcrypt.hashSync(password, 10) : user.password
      })

      // 找出使用者avatar & cover
      let avatar = files?.avatar || null
      let cover = files?.cover || null
      if (avatar) {
        avatar = await imgurFileHandler(avatar[0])
      }
      if (cover) {
        cover = await imgurFileHandler(cover[0])
      }

      // 使用者頁面更新
      const updateUserProfile = await updateUser.update({
        introduction: introduction,
        avatar: avatar || user.avatar,
        cover: cover || user.cover
      })

      const data = updateUserProfile.toJSON()
      delete user.password
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = user2Controller
