const jwt = require('jsonwebtoken')
const { imgurFileHandler } = require('../helpers/file-helper')
const { User, Tweet, Like, Reply, Followships } = require('../models')
const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')


const userController = {
  signIn: (req, res, next) => {
    // 從req取資料
    const { account, password } = req.body

    // 以account取user data
    return User.findOne({ where: { account } })
      .then(user => {
        // 判斷使用者是否存在
        if (!user) return res.json({ status: 'error', message: '帳號與密碼不存在' })
        user = user.toJSON()

        return bcrypt.compare(password, user.password)
          .then(isCorrect => {
            // 判斷密碼與使用者身份是否正確
            if (!isCorrect) return res.json({ status: 'error', message: '帳號與密碼不存在' })
            if (user.role !== 'user') return res.json({ status: 'error', message: '帳號與密碼不存在' })

            // 透過jwt簽發token
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
            delete user.password
            // 傳給用戶端
            return res.json({
              status: 'success',
              token,
              user
            })
          })
          .catch(err => next(err))
      })
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    // 欄位不能空白
    if (!account || !name || !email || !password || !checkPassword) {
      return res.json({ status: 'error', message: '欄位不可空白' })
    }
    // password 與 checkPassword 不相同
    if (password !== checkPassword) {
      return res.json({ status: 'error', message: '確認密碼錯誤' })
    }
    // name 字數 < 50
    if (name.length > 50) {
      return res.json({ status: 'error', message: '名稱字數最多 50 字' })
    }
    // account email 已經被使用
    return Promise.all([
      User.findOne({ where: { account }, attributes: ['id'] }),
      User.findOne({ where: { email }, attributes: ['id'] })
    ])
      .then(([accountUser, emailUser]) => {
        if (accountUser) {
          return res.json({ status: 'error', message: 'account 已重複註冊!' })
        }
        if (emailUser) {
          return res.json({ status: 'error', message: 'email 已重複註冊!' })
        }

        // 新增User資料，並回傳成功訊息
        return User.create({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, 10),
          role: 'user'
        })
          .then(() => res.json({ status: 'success', message: '註冊成功' }))
      })
      .catch(err => next(err))
  },
  // 使用者頁面
  getUser: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return User.findByPk(req.params.id, {
      include: [
        { model: Tweet, attributes: ['id'] },
        { model: User, as: "Followings", attributes: ['id'] },
        { model: User, as: "Followers", attributes: ['id'] }
      ],
      attributes: { exclude: ['password', 'role', 'createdAt', 'updatedAt'] }

    })
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        user = user.toJSON()
        const data = {
          id: user.id,
          account: user.account,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          cover: user.cover,
          introduction: user.introduction,
          tweetCount: user.Tweets ? user.Tweets.length : 0,
          followingCount: user.Followings ? user.Followings.length : 0,
          follwerCount: user.Followers ? user.Followers.length : 0,
          isFollowed: user.Followers ? user.Followers.some(u => u.id === currentUser.id) : false

        }

        res.json(data)
      })
      .catch(err => next(err))
  },
  // 回覆過的推文
  getRepliedTweets: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id, { attributes: ['id'] }),
      Reply.findAll({
        where: { UserId: req.params.id },
        include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] },
        {
          model: Tweet, attributes: ['id'],
          include: [{ model: User, attributes: ['id', 'name', 'account'] }]
        }
        ],
        attributes: ['id', 'comment', 'createdAt'],
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, replies]) => {
        if (!user) return res.json({ status: 'error', message: '使用者不存在!' })

        return res.json(replies)
      })
      .catch(err => next(err))
  },
  // 使用者推文
  getUserTweets: (req, res, next) => {
    // 使用helpers取得登入者資訊
    const currentUser = helpers.getUser(req)

    // 取出user與tweet資料
    return Promise.all([
      User.findByPk(req.params.id, { attributes: ['id'] }),
      Tweet.findAll({
        where: { UserId: req.params.id },
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['id', 'UserId'] }
        ],
        attributes: ['id', 'description', 'createdAt'],
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, tweets]) => {
        // 判斷是否有該查詢使用者
        if (!user) return res.json({ status: 'error', message: '使用者不存在!' })

        // 將tweet迭代，並回傳所以資料陣列
        const data = tweets.map(tweet => {
          tweet = tweet.toJSON()
          return {
            id: tweet.id,
            description: tweet.description,
            createdAt: tweet.createdAt,
            User: {
              id: tweet.User.id,
              account: tweet.User.account,
              name: tweet.User.name,
              avatar: tweet.User.avatar
            },
            likeCount: tweet.Likes.length,
            replyCount: tweet.Replies.length,
            isLiked: tweet.Likes.map(user => user.UserId).includes(currentUser.id)
          }

        })
        return res.json(data)
      })
      .catch(err => next(err))
  },
  // 喜歡的推文
  getLikedTweet: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Like.findAll({
        where: { UserId: req.params.id },
        include: [{
          model: Tweet,
          include: [{ model: User },
            Reply,
            Like
          ]
        }],
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, likes]) => {
        if (!user) throw new Error('使用者不存在!')
        likes = likes.map(like => ({
          ...like.dataValues,
          likeCount: like.dataValues.Tweet.Likes ? like.dataValues.Tweet.Likes.length : 0,
          replyCount: like.dataValues.Tweet.Replies ? like.dataValues.Tweet.Replies.length : 0,
          isLiked: like.dataValues.Tweet.Likes ? like.dataValues.Tweet.Likes.map(user => user.UserId).includes(helpers.getUser(req).id) : 0
        }))
        res.json(likes)
      })
      .catch(err => next(err))
  },
  getFollowings: (req, res, next) => {
    // 依req的id從User抓資料
    return User.findByPk(req.params.id, {
      include: [{
        model: User, as: 'Followings', include: Followships
      }]
    })
      .then(user => {
        // 判斷是否有使用者
        if (!user) return res.json({ status: 'error', message: '使用者不存在!' })
        user = user.toJSON()
        // 將usee.following從物件拿出
        const Followings = user.Followings
        // 將followings迭代，並將id重新命名為followingId，並回傳成陣列
        const data = Followings.map(following => {
          return {
            followingId: following.id,
            account: following.account,
            email: following.email,
            name: following.name,
            avatar: following.avatar,
            cover: following.cover,
            createdAt: following.Followship.createdAt,
            introduction: following.introduction,
            isFollowed: helpers.getUser(req).Followings ? helpers.getUser(req).Followings.some(u => u.id === following.id) : 0
          }
        })
          .sort((a, b) => b.createdAt - a.createdAt)
        res.json(data)
      })
      .catch(err => next(err))
  },
  getFollowers: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [{
        model: User, as: 'Followers', include: Followships
      }]
    })
      .then(user => {
        // 判斷是否有使用者
        if (!user) return res.json({ status: 'error', message: '使用者不存在!' })
        // 將usee.Followers從物件拿出
        user = user.toJSON()
        const followers = user.Followers

        // 將followings迭代，並將id重新命名為followingId，並回傳成陣列
        const data = followers.map(follower => {
          return {
            followerId: follower.id,
            account: follower.account,
            email: follower.email,
            name: follower.name,
            avatar: follower.avatar,
            cover: follower.cover,
            createdAt: follower.Followship.createdAt,
            introduction: follower.introduction,
            isFollowed: helpers.getUser(req).Followings ? helpers.getUser(req).Followings.some(u => u.id === follower.id) : 0
          }
        })
          .sort((a, b) => b.createdAt - a.createdAt)
        res.json(data)
      })
      .catch(err => next(err))
  },
  // 編輯自介相關資料
  putUser: (req, res, next) => {
    const { name, introduction } = req.body
    const currentUser = helpers.getUser(req)
    // 只能編輯自己的資料
    if (Number(req.params.id) !== currentUser.id) {
      return res.json({ status: 'error', message: '權限錯誤' })
    }
    // 修改限制
    if (name && name.length > 50) {
      return res.json({ status: 'error', message: '名稱字數最多 50 字' })
    }
    if (introduction && introduction.length > 160) {
      return res.json({ status: 'error', message: '自介字數最多 160 字' })
    }

    const { files } = req
    let avatarfile = ''
    let coverfile = ''
    if (files) {
      if (files.avatar) {
        avatarfile = files.avatar[0]
      }
      if (files.cover) {
        coverfile = files.cover[0]
      }
    }
    return Promise.all([
      User.findByPk(currentUser.id, { attributes: ['id'] }),
      imgurFileHandler(avatarfile),
      imgurFileHandler(coverfile),
    ])
      .then(([user, avatarPath, coverPath]) => {
        if (!user) return res.json({ status: 'error', message: '使用者不存在!' })
        return user.update({
          name,
          introduction,
          avatar: avatarPath || user.avatar,
          cover: coverPath || user.cover,
        })
      })
      .then(user => {
        res.json({
          status: 'success', user
        })
      })
      .catch(err => next(err))
  },
  // 編輯帳號密碼相關資料
  editUser: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const currentUser = helpers.getUser(req)
    // 只能編輯自己的資料
    if (Number(req.params.id) !== currentUser.id) {
      return res.json({ status: 'error', message: '權限錯誤' })
    }
    // 欄位不能空白
    if (!account || !name || !email || !password || !checkPassword) {
      return res.json({ status: 'error', message: '欄位不可空白' })
    }
    // password 與 checkPassword 不相同
    if (password !== checkPassword) {
      return res.json({ status: 'error', message: '確認密碼錯誤' })
    }
    // name 字數 < 50
    if (name.length > 50) {
      return res.json({ status: 'error', message: '名稱字數最多 50 字' })
    }
    // account email 已經被使用
    return Promise.all([
      User.findByPk(req.params.id, { attributes: ['id', 'account', 'email'] }),
      User.findOne({ where: { account }, attributes: ['id', 'account'] }),
      User.findOne({ where: { email }, attributes: ['id', 'email'] })
    ])
      .then(([user, accountUser, emailUser]) => {
        if (!user) return res.json({ status: 'error', message: '使用者不存在!' })
        if (accountUser && accountUser.account !== user.account) {
          return res.json({ status: 'error', message: 'account 已重複註冊!' })
        }
        if (emailUser && emailUser.email !== user.email) {
          return res.json({ status: 'error', message: 'email 已重複註冊!' })
        }
        return user.update({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, 10)
        })
      })
      .then(user => {
        res.json({
          status: 'success', message: '資料編輯成功', user: {
            id: user.id,
            account: user.account,
            name: user.name,
            updatedAt: user.updatedAt
          }
        })
      })
      .catch(err => next(err))
  },

  //取得熱門使用者
  getTopUsers: (req, res, next) => {
    // 預設取得10位使用者， 並判斷是否有查詢變數來改變取得長度
    const DEFAULT_LIMIT = 10
    const limit = req.query.limit ? req.query.limit : DEFAULT_LIMIT
    const currentUserAccount = helpers.getUser(req).account

    // 取得所有使用者資料，用多對多關連，取得使用者追蹤資料
    return User.findAll({
      where: { account: { $not: ['root', currentUserAccount] } },
      include: [{ model: User, as: 'Followers', attributes: ['id', 'name'] }],
      attributes: ['id', 'name', 'avatar', 'account']
    })
      .then(users => {
        // 重新編排資料，並計算追隨者數量、登入者是否有追蹤
        const data = users.map(user => {
          user = user.toJSON()
          return {
            id: user.id,
            account: user.account,
            name: user.name,
            avatar: user.avatar,
            followerCount: user.Followers.length,
            isFollowed: helpers.getUser(req).Followings.some(f => f.id === user.id)
          }

        })
          .sort((a, b) => b.followerCount - a.followerCount) // 依followerCount降冪排列
          .slice(0, limit) // 取得所設定數量

        res.json(data)
      })
      .catch(err => next(err))
  },
  getCurrentUser: (req, res, next) => {
    const { id, account, email, name, avatar, cover, introduction, role } = helpers.getUser(req).dataValues
    return res.json({
      id,
      account,
      email,
      name,
      avatar,
      cover,
      introduction,
      role
    })
  }


}

module.exports = userController