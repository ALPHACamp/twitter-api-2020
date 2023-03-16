const sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const { User, Tweet, Followship, Like, Reply } = require('../models')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userServices = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.checkPassword) {
      throw new Error('密碼不一致 !')
    }

    const { account, name, email, password } = req.body

    if (name.length > 50) throw new Error('字數超出上限！')

    return Promise.all([
      // 先將 account 轉換成小寫
      User.findOne({ where: { account: account.toLowerCase() }, raw: true }),
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
      .catch(err => cb(err))
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

    User.findOne({ where: { account, role: 'user' }, raw: true })
      .then(user => {
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
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    const { id } = req.params
    const loginUser = helpers.getUser(req)

    return Promise.all([
      User.findByPk(id, {
        include: [
          Tweet,
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      })
    ])
      .then(([user]) => {
        if (!user) throw new Error('使用者不存在 !')
        // 儲存登入者的追蹤者 id
        const checkBox = []

        loginUser.Followings.forEach(f => {
          checkBox.push(f.id)
        })
        // 使用者推文數
        const tweetCount = user.Tweets.length
        // 使用者追蹤數
        const followingCount = user.Followings.length
        // 使用者被追蹤數
        const followerCount = user.Followers.length
        // 登入者與個別使用者追蹤關係
        const isFollowed = checkBox.includes(user.id)

        user = user.toJSON()
        // 刪除非必要屬性
        delete user.Tweets
        delete user.Followings
        delete user.Followers
        delete user.password
        // 新增屬性
        user.tweetCount = tweetCount
        user.followingCount = followingCount
        user.followerCount = followerCount
        user.isFollowed = isFollowed

        return res.status(200).send(user)
      })
      .catch(err => next(err))
  },
  putUser: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req)?.id
      const id = Number(req.params.id)
      let {
        account,
        name,
        email,
        password,
        checkPassword,
        introduction,
        cover
      } = req.body
      const { files } = req

      if (id !== currentUserId) {
        throw new Error('不可編輯他人資料 !')
      } // 不可編輯別人的檔案
      if (password !== checkPassword) {
        throw new Error('密碼不一致 !')
      } // 密碼不相符
      if (name?.length > 50) throw new Error('字數超出上限！') // 名字太長
      if (introduction?.length > 160) {
        throw new Error('字數超出上限！')
      } // 自介太長

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
          if (accountExist) {
            return res
              .status(401)
              .json({ success: false, message: 'account 已重複註冊！' })
          }
        }
      }
      if (email) {
        if (email !== user.email) {
          const emailExist = await User.findOne({ where: { email } })
          if (emailExist) {
            return res
              .status(401)
              .json({ success: false, message: 'email 已重複註冊！' })
          }
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
      let avatarFile = files?.avatar || null
      let coverFile = files?.cover || null

      if (avatarFile) {
        avatarFile = await imgurFileHandler(avatarFile[0])
      }
      if (coverFile) {
        coverFile = await imgurFileHandler(coverFile[0])
      }

      // 前端在刪除時，會傳送 null 值給 cover
      // 只需判斷 cover ，不須判斷 avatar，因為不能刪除 avatar

      if (coverFile === null) {
        await User.findByPk(currentUserId).then(user => {
          // 未上傳檔案
          // 使用者本來有上傳過 cover，決定不編輯
          if (user.cover !== null) {
            updateUser.update({
              cover: user.cover
            })
          }
          // 使用者刪除 cover，前端傳來 deleteCover 字串
          if (cover === 'deleteCover') {
            updateUser.update({
              cover: null
            })
          }
        })
      }

      // 使用者頁面更新
      const updateUserProfile = await updateUser.update({
        introduction: introduction,
        avatar: avatarFile || user.avatar,
        cover: coverFile || user.cover
      })

      const data = updateUserProfile.toJSON()
      delete user.password
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  getFollowing: (req, res, next) => {
    const { id } = req.params
    const user = helpers.getUser(req)
    return Promise.all([
      User.findByPk(id, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Followship.findAll({ where: { followerId: id }, raw: true })
    ])
      .then(([trackData, followingList]) => {
        // 若沒有跟隨者，回傳空陣列
        if (!trackData) return res.status(200).send([])
        // 儲存登入者的追蹤者 id
        const checkBox = []
        // 登入者的追蹤者 id
        user.Followings.forEach(f => {
          checkBox.push(f.id)
        })

        // 儲存追蹤者清單屬性
        const followingsbox = []

        trackData.Followings.forEach(l => {
          const temp = {}
          const data = {}
          data.id = l.id
          data.name = l.name
          data.avatar = l.avatar
          data.introduction = l.introduction
          temp.result = data
          followingsbox.push(temp)
        })

        // console.log('followingsbox: ', followingsbox)
        followingList.forEach((list, index) => {
          // 將 followingId 改成 id
          list.id = list.followingId
          // 新增 isFollowed, name, introduction, avatar 屬性
          list.name = followingsbox[index].result.name
          list.avatar = followingsbox[index].result.avatar
          list.introduction = followingsbox[index].result.introduction
          list.isFollowed = checkBox.includes(list.followingId)
          // 刪除 followerId
          delete list.followerId
        })
        // 照日期排序 (新至舊)
        followingList.sort((a, b) => b.createdAt - a.createdAt)

        res.status(200).send(followingList)
      })
      .catch(err => next(err))
  },
  getFollower: (req, res, next) => {
    const { id } = req.params
    const user = helpers.getUser(req)
    return Promise.all([
      User.findByPk(id, {
        include: [
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      }),
      Followship.findAll({ where: { followingId: id }, raw: true })
    ])
      .then(([trackData, followerList]) => {
        // 若沒有追隨者，回傳空陣列
        if (!trackData) return res.status(200).send([])
        // 儲存登入者的追蹤者 id
        const checkBox = []
        // 登入者的追蹤者 id
        user.Followings.forEach(f => {
          checkBox.push(f.id)
        })

        // 儲存追隨者清單屬性
        const followersbox = []

        trackData.Followers.forEach(l => {
          const temp = {}
          const data = {}
          data.id = l.id
          data.name = l.name
          data.avatar = l.avatar
          data.introduction = l.introduction
          temp.result = data
          followersbox.push(temp)
        })

        followerList.forEach((list, index) => {
          // 將 followerId 改成 id
          list.id = list.followerId
          // 新增 isFollowed, name, introduction, avatar 屬性
          list.name = followersbox[index].result.name
          list.avatar = followersbox[index].result.avatar
          list.introduction = followersbox[index].result.introduction
          list.isFollowed = checkBox.includes(list.followerId)
          // 刪除 followingId
          delete list.followingId
        })
        // 照日期排序 (新至舊)
        followerList.sort((a, b) => b.createdAt - a.createdAt)

        res.status(200).send(followerList)
      })
      .catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    User.findAll({
      where: { role: 'user' },
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: req.user.Followings.some(f => f.id === user.id) // 登入者是否追隨名單中的使用者
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        const finalResult = result.slice(0, 9) // 取前10名
        res.status(200).send(finalResult)
      })
      .catch(err => next(err))
  },
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

    return Promise.all([
      User.findByPk(UserId),
      // 用UserId去撈Like關聯tweet，找到使用者like過的tweet資料
      // 再用tweet去關聯user跟like資料，取得tweet-user跟like資料，判斷登入使用者isliked布林值
      Like.findAll({
        where: { UserId },
        include: [{
          model: Tweet,
          include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }, { model: Like }],
          attributes: {
            include: [
              [
                sequelize.literal('(SELECT COUNT(*) FROM Replies AS replyCount WHERE tweet_id = Tweet.id)'), 'replyCount' // 回傳留言數
              ],
              [
                sequelize.literal('(SELECT COUNT(*) FROM Likes AS likeCount WHERE tweet_id = Tweet.id)'), 'likeCount' // 回傳按讚數
              ]]
          }
        }],
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, likes]) => {
        if (!user) throw new Error("User didn't exist")
        const data = likes.map(like => {
          const { Likes, ...data } = like.Tweet.toJSON()
          const userLikes = like.Tweet.toJSON().Likes
          data.isLiked = userLikes.some(like => like.UserId === currentUserId)
          data.TweetId = like.Tweet.toJSON().id
          delete data.UserId
          return data
        })
        res.status(200).json(data)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
