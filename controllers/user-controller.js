const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const helpers = require('../_helpers')

const userController = {
  // 登入驗證成功後的動作
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({ success: true, data: { token, user: userData } })
    } catch (err) {
      next(err)
    }
  },
  // 註冊帳號
  signUp: (req, res, next) => {
    if (req.body.name.length > 50) throw new Error('name 字數大於 50')

    return Promise.all([
      User.findOne({ where: { email: req.body.email } }),
      User.findOne({ where: { account: req.body.account } })
    ])
      .then(([emailResult, accountResult]) => {
        if (emailResult && accountResult) throw new Error('email 與 account 都重複註冊！')
        if (emailResult) throw new Error('email 已重複註冊！')
        if (accountResult) throw new Error('account 已重複註冊！')
      })
      .then(() => bcrypt.hash(req.body.password, 10))
      .then(hash =>
        User.create({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: hash,
          role: 'user'
        })
      )
      .then(createdUser => {
        const result = createdUser.toJSON()
        delete result.password // 避免不必要資料外洩
        res.status(200).json({ success: true, user: result })
      })
      .catch(err => next(err))
  },
  // 取得某 user 的資料
  getUserInfo: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('Can not find this user.')
        delete user.password
        user.isFollowed = currentUser.Followings.some(f => f.id === user.id)
        user.isNotified = currentUser.Followings.some(f => f.id === user.id)
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  // 更新 notify 狀態
  patchNotification: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return Followship.findOne({
      where: {
        followerId: currentUser.id,
        followingId: req.params.id
      }
    })
      .then(n => {
        if (!n) throw new Error("You haven't follow this user.")
        return n.update({ isNotified: !n.isNotified })
      })
      .then(n => {
        return res.status(200).json({ success: true, n })
      })
      .catch(err => next(err))
  },
  // 更新 user 個人資料
  putUser: (req, res, next) => {
    const id = Number(req.params.id)
    const oldPW = helpers.getUser(req).password
    if (helpers.getUser(req).id !== id) {
      return res.status(401).json({
        success: false,
        message: 'Sorry. You do not own this account.'
      })
    }
    // 檢驗每個 key/value
    for (const key in req.body) {
      if (!req.body[key].trim()) throw new Error(`${key} 不能輸入空白`)
    }
    const { files } = req // 上傳多個檔時，會改擺在 req.files
    // 必須先知道有哪些要更動 (變數量可能有變!!)
    let { account, email, password } = req.body // 管他有沒有都先設，之後確保正確使用就好
    if (account === helpers.getUser(req).account) {
      account = undefined
    }
    if (email === helpers.getUser(req).email) {
      email = undefined
    }
    const upload = {}
    for (const key in files) {
      upload[key] = { path: files[key][0].path }
    }
    return Promise.all([
      imgurFileHandler(upload.image),
      imgurFileHandler(upload.avatar),
      User.findByPk(id),
      // (下1) false 要擺 account 根本不存在 (不更動 account) 的狀況
      account ? User.findOne({ where: { account } }) : undefined,
      email ? User.findOne({ where: { email } }) : undefined,
      password ? bcrypt.compare(password, oldPW) : true
    ])
      .then(([imagePath, avatarPath, user, sameAcc, sameMail, samePW]) => {
        if (!user) throw new Error("User doesn't exist!")
        if (sameAcc) throw new Error('account 已重複註冊！')
        if (sameMail) throw new Error('email 已重複註冊！')
        if (samePW) {
          req.body.password = oldPW
        } else {
          bcrypt.hash(password, 10).then(password => user.update({ password }))
        }
        req.body.account = account
        req.body.email = email
        req.body.image = imagePath || user.image
        req.body.avatar = avatarPath || user.avatar
        return user.update(req.body) // 試試看唄，看能不能回傳 array
      })
      .then(updatedUser => {
        const result = updatedUser.toJSON()
        delete result.password
        return res.status(200).json(result)
      })
      .catch(err => next(err))
  },
  // 取得某 user 發的所有推文
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      where: { UserId: req.params.id }, // 為了測試檔而改成這樣
      order: [['createdAt', 'DESC'], ['id', 'ASC']],
      include: [{ model: Like, attributes: ['UserId'] }, { model: Reply, attributes: ['id'] }]
    })
      .then(tweets => {
        const result = tweets.map(tweet => {
          tweet = tweet.toJSON()
          tweet.isLiked = tweet.Likes.some(like => like.UserId)
          tweet.likeCounts = tweet.Likes.length
          tweet.replyCounts = tweet.Replies.length
          delete tweet.Likes
          delete tweet.Replies
          return tweet
        })
        return res.status(200).json(result)
      })
      // ? 成品 end~~~~~~~
      .catch(err => next(err))
  },
  // 取得某 user 發的所有回覆
  getReplies: (req, res, next) => {
    return Reply.findAll({
      where: { UserId: req.params.id },
      raw: true,
      order: [['createdAt', 'DESC']],
      include: { model: Tweet, attributes: [], include: { model: User, attributes: ['account'] } },
      nest: true
    })
      .then(replies => res.status(200).json(replies))
      .catch(err => next(err))
  },
  // 取得某 user 所有的 like 記錄
  getLikes: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return Like.findAll({
      where: { UserId: req.params.id },
      order: [['createdAt', 'DESC']],
      include: {
        model: Tweet,
        attributes: ['description'],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Reply },
          { model: Like }
        ]
      },
      nest: true
    })
      .then(likes => {
        if (!likes) throw new Error('Cannot find this record.')
        const data = likes.map(li => {
          li = li.toJSON()
          if (li.Tweet && currentUser.Likes) {
            li.Tweet.currentUserLikes = currentUser.Likes.some(l => l.TweetId === li.TweetId)
            li.Tweet.replyCounts = li.Tweet.Replies.length
            li.Tweet.likeCounts = li.Tweet.Likes.length
            delete li.Tweet.Replies
            delete li.Tweet.Likes
          }
          return li
        })
        res.status(200).json(data)
      })
      .catch(err => next(err))
  },
  // 取得某 user 所有 follow 的人
  getFollowings: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return User.findByPk(req.params.id, {
      include: {
        model: User,
        as: 'Followings',
        attributes: ['id', 'name', 'avatar', 'introduction']
      }
    })
      .then(user => {
        if (!user) throw new Error('Cannot find this user.')
        const data = user.Followings.map(u => {
          u = u.toJSON()
          u.currentUserIsFollowing = currentUser.Followings.some(f => f.id === u.id)
          u.followingId = u.Followship.followingId
          u.followshipCreatedAt = u.Followship.createdAt
          delete u.Followship
          return u
        }).sort((a, b) => {
          return b.followshipCreatedAt.getTime() - a.followshipCreatedAt.getTime()
        })
        res.status(200).json(data)
      })
      .catch(err => next(err))
  },
  // 取得某 user 所有的追隨者
  getFollowers: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return User.findByPk(req.params.id, {
      attributes: [],
      include: {
        model: User,
        as: 'Followers',
        attributes: ['id', 'name', 'avatar', 'introduction']
      }
    })
      .then(user => {
        if (!user) throw new Error('Cannot find this user.')
        const data = user.Followers.map(u => {
          u = u.toJSON()
          u.currentUserIsFollowing = currentUser.Followings.some(f => f.id === u.id)
          u.followerId = u.Followship.followerId
          u.followshipCreatedAt = u.Followship.createdAt
          delete u.Followship
          return u
        }).sort((a, b) => {
          return b.followshipCreatedAt.getTime() - a.followshipCreatedAt.getTime()
        })
        res.status(200).json(data)
      })
      .catch(err => next(err))
  },
  // follow 某 user
  addFollowing: (req, res, next) => {
    const followingId = Number(req.body.id) // 要 follow 的對象
    const followerId = helpers.getUser(req).id
    return Followship.findOne({ where: { followingId, followerId } })
      .then(followRecord => {
        if (followRecord) {
          const err = new Error('you already followed this user.')
          err.status = 409
          throw err
        }
      })
      .then(() => User.findByPk(followingId))
      .then(following => {
        if (!following) {
          const err = new Error('Cannot find this user')
          err.status = 404
          throw err
        }
        if (following.id === followerId) throw new Error('不能追蹤自己')
        return Followship.create({ followerId, followingId })
      })
      .then(following => {
        return res.status(200).json({ success: true, following })
      })
      .catch(err => next(err))
  },
  // 取消 follow 某 user
  removeFollowing: (req, res, next) => {
    const { followingId } = req.params
    return Followship.findOne({ where: { followingId, followerId: helpers.getUser(req).id } })
      .then(following => {
        if (!following) throw new Error('Cannot find this record.')
        following.destroy()
        return res.status(200).json({ success: true, following })
      })
      .catch(err => next(err))
  },
  // 取得 follower 前十多的 user
  getTopFollowing: (req, res, next) => {
    return User.findAll({
      attributes: ['id', 'email', 'account', 'name'],
      where: { role: 'user' },
      include: [{ model: User, as: 'Followers', attributes: ['id'] }]
    })
      .then(users => {
        users = users.map(user => {
          user = user.toJSON()
          user.FollowerCounts = user.Followers.length
          delete user.Followers
          return user
        })
          .sort((a, b) => b.FollowerCounts - a.FollowerCounts)
          .slice(0, 10)
        return res.status(200).json({ success: true, users })
      })
      .catch(err => next(err))
  },
  // 增加 like 記錄
  addLike: (req, res, next) => {
    return Promise.all([
      Tweet.findByPk(req.params.id),
      User.findByPk(helpers.getUser(req).id)
    ])
      .then(([tweet, user]) => {
        if (!tweet) throw new Error('Tweet does not exist.')
        if (!user) throw new Error('User does not exsit.')
        return Like.create({
          TweetId: tweet.id,
          UserId: user.id
        })
      })
      .then(like => res.status(200).json({ success: true, like }))
      .catch(err => next(err))
  },
  // 刪除 like 記錄
  removeLike: (req, res, next) => {
    const TweetId = req.params.id
    return Like.findOne({ where: { TweetId } })
      .then(like => {
        if (!like) throw new Error('We can not find this like record.')
        return like.destroy()
      })
      .then(like => res.status(200).json({ success: true, like }))
      .catch(err => next(err))
  }
}

module.exports = userController
