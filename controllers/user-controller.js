const createToken = require('../helpers/token')
const { User, Tweet, Reply, Like } = require('../models')
const bcrypt = require('bcryptjs')
const { imgurCoverHandler, imgurAvatarHandler } = require('../helpers/file-helpers')

const userController = {
  login: async (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      if (userData.role !== 'user') throw new Error('非使用者')
      const token = await createToken(userData)
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    const { name, account, email, password, checkPassword } = req.body
    if (!name) throw new Error('請輸入名字')
    if (!account) throw new Error('請輸入帳號')
    if (!email) throw new Error('請輸入信箱')
    if (!password) throw new Error('請輸入密碼')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不符，請重新輸入')
    try {
      return Promise.all([
        User.findOne({ where: { email: req.body.email } }),
        User.findOne({ where: { account: req.body.account } })
      ])
        .then(user => {
          if (user) return res.status(403).json({ status: 'error', message: '此Email已被註冊！！' })
          // if (user) throw new Error('此Email已被註冊！！')
          return bcrypt.hash(req.body.password, 10)
            .then(hash => User.create({
              name: req.body.name,
              account: req.body.account,
              email: req.body.email,
              password: hash,
              role: 'user'
            }))
            .then(user => {
              res.json({ status: 'success', user })
            })
        })
    } catch (err) {
      next(err)
    }
  },
  getUser: (req, res, next) => {
    try {
      const id = req.params.id
      User.findByPk(id, {
        include: [
          Tweet,
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
        .then(user => {
          if (!user) throw new Error('找不到使用者！')
          user = user.toJSON()
          res.json({
            status: 'success',
            ...user,
            tweetCount: user.Tweets.length,
            followingsCount: user.Followings.length,
            followersCount: user.Followers.length
          })
        })
    } catch (err) {
      next(err)
    }
  },
  getUserTweet: (req, res, next) => {
    try {
      const UserId = req.params.id

      Tweet.findAll({
        where: { UserId },
        order: [['createdAt', 'DESC']],
        include: [User, { model: Like, attributes: ['id'] }, { model: Reply, attributes: ['id'] }],
        nest: true
      })
        .then(tweets => {
          if (!tweets) throw new Error('找不到使用者的推文！')
          const newData = []
          // eslint-disable-next-line array-callback-return
          tweets = tweets.map(tweet => {
            const tweetsJSON = tweet.toJSON()
            newData.push({
              tweetId: tweetsJSON.id,
              description: tweetsJSON.description,
              userId: tweetsJSON.UserId,
              userName: tweetsJSON.User.name,
              userAvatar: tweetsJSON.User.avatar,
              userEmail: tweetsJSON.User.email,
              likeCount: tweetsJSON.Likes.length,
              replyCount: tweetsJSON.Replies.length,
              tweetCreateAt: tweetsJSON.createdAt,
              tweetUpdatedAt: tweetsJSON.updatedAt
            })
          })
          res.json(newData)
        })
    } catch (err) {
      next(err)
    }
  },
  userRepliedTweets: (req, res, next) => {
    try {
      const UserId = req.params.id
      Reply.findAll({
        where: { UserId },
        include: [
          { model: Tweet, include: User, attributes: { exclude: ['password'] } },
          { model: User, attributes: { exclude: ['password'] } }
        ],
        raw: true,
        nest: true
      })
        .then(reply => {
          if (!reply) {
            res.status(403).json({ status: 'error', message: '找不到使用者的回覆！' })
          }
          const repeatDataId = []
          const rawData = []
          // eslint-disable-next-line array-callback-return
          reply.map(reply => {
            if (!repeatDataId.includes(reply.TweetId)) {
              repeatDataId.push(reply.TweetId)
              rawData.push(reply)
            } else {
              return false
            }
          })
          console.log(rawData)
          const data = rawData.map(element => ({
            userName: element.User.name,
            userAccount: element.User.account,
            tweetAccount: element.Tweet.User.account,
            replyId: element.id,
            comment: element.comment,
            createAt: element.createdAt
          }))
          res.json(data)
        })
    } catch (err) {
      next(err)
    }
  },
  userLikes: async (req, res, next) => {
    try {
      const UserId = req.params.id
      const rawUserLikes = await Like.findAll({
        where: {
          UserId
        },
        include: [{
          model: Tweet,
          attributes: [
            'id'
          ]
        }],
        nest: true,
        raw: true
      })
      if (!rawUserLikes.length) throw new Error('使用者沒有喜歡的推文')
      const likeTweetId = []

      for (let index = 0; index < rawUserLikes.length; index++) {
        likeTweetId.push(rawUserLikes[index].Tweet.id)
      }

      const likeTweets = await Tweet.findAll({
        where: {
          id: likeTweetId
        },
        include: [
          { model: User }
        ],
        nest: true,
        raw: true
      })

      // 推文 like 總數
      const likes = await Like.count({
        group: ['Tweet_id']
      })

      if (!likes) {
        for (let index = 0; index < likeTweets.length; index++) {
          likeTweets[index].totalLikeCount = 0
        }
      }

      for (let likesIndex = 0; likesIndex < likes.length; likesIndex++) {
        for (let tweetIndex = 0; tweetIndex < likeTweets.length; tweetIndex++) {
          if (likeTweets[tweetIndex].id === likes[likesIndex].Tweet_id) {
            likeTweets[tweetIndex].totalLikeCount = likes[likesIndex].count
          } else {
            if (likeTweets[tweetIndex].totalLikeCount === undefined) likeTweets[tweetIndex].totalLikeCount = 0
          }
        }
      }
      // 推文 reply 總數
      const replies = await Reply.count({
        group: ['Tweet_id']
      })

      if (!replies) {
        for (let index = 0; index < likeTweets.length; index++) {
          likeTweets[index].totalReplyCount = 0
        }
      }
      for (let replyIndex = 0; replyIndex < replies.length; replyIndex++) {
        for (let tweetIndex = 0; tweetIndex < likeTweets.length; tweetIndex++) {
          if (likeTweets[tweetIndex].id === replies[replyIndex].Tweet_id) {
            likeTweets[tweetIndex].totalReplyCount = replies[replyIndex].count
          } else {
            if (likeTweets[tweetIndex].totalReplyCount === undefined) likeTweets[tweetIndex].totalReplyCount = 0
          }
        }
      }
      const data = likeTweets.map(element => ({
        TweetId: element.id,
        description: element.description,
        createdAt: element.createAt,
        name: element.User.name,
        account: element.User.account,
        avatar: element.User.avatar,
        totalLikeCount: element.totalLikeCount,
        totalReplyCount: element.totalReplyCount
      }))
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  userFollowings: (req, res, next) => {
    try {
      const id = req.params.id
      User.findAll({
        attributes: { exclude: ['password'] },
        where: { id },
        include: [{ model: User, as: 'Followings', include: [Tweet], attributes: ['id', 'account', 'name', 'avatar'] }],
        nest: true
      })
        .then(followingUsers => {
          followingUsers = followingUsers[0].toJSON()
          const newData = []
          // eslint-disable-next-line array-callback-return
          followingUsers.Followings.map(user => {
            if (Number(user.Followship.followerId) === Number(id)) {
              newData.push({
                ...user,
                followingId: user.Followship.followingId,
                followerId: user.Followship.followerId,
                isFollowed: true
              })
            } else {
              newData.push({
                ...user,
                followingId: user.Followship.followingId,
                followerId: user.Followship.followerId,
                isFollowed: false
              })
            }
          })
          res.json(newData)
        })
    } catch (err) {
      next(err)
    }
  },
  userFollowers: (req, res, next) => {
    try {
      const id = req.params.id
      User.findAll({
        where: { id },
        attributes: { exclude: ['password'] },
        include: [{ model: User, as: 'Followers', include: [Tweet], attributes: ['id', 'account', 'name', 'avatar'] }, { model: User, as: 'Followings', attributes: ['id', 'account'] }],
        nest: true
      })
        .then(followings => {
          const newData = []
          const followingsJsonData = followings[0].toJSON()
          // eslint-disable-next-line array-callback-return
          followingsJsonData.Followers.map(follower => {
            if (followingsJsonData.Followings.some(data => data.Followship.followingId === follower.Followship.followerId)) {
              newData.push({
                ...follower,
                followingId: follower.Followship.followingId,
                followerId: follower.Followship.followerId,
                isFollowed: true
              })
            } else {
              newData.push({
                ...follower,
                followingId: follower.Followship.followingId,
                followerId: follower.Followship.followerId,
                isFollowed: false
              })
            }
          })
          res.json(newData)
        })
    } catch (err) {
      next(err)
    }
  },
  putUser: (req, res, next) => {
    try {
      const UserId = req.params.id
      const { name, account, email, password, checkPassword, introduction } = req.body
      // 個人資料修改頁面
      if (password || account || email) {
        if (!name) throw new Error('請輸入使用者姓名！')
        if (!account) throw new Error('此欄位為必填欄位')
        if (!checkPassword) throw new Error('請輸入確認密碼')
        if (password !== checkPassword) throw new Error('確認密碼有誤，請重新輸入一次')
        return Promise.all([
          User.findByPk(UserId),
          User.findOne({ where: { account } }),
          User.findOne({ where: { email } })
        ])
          .then(([user, accountUser, emailUser]) => {
            if (!user) res.status(403).json({ status: 'error', message: '使用者不存在！' })
            if (accountUser && Number(accountUser.dataValues.id) !== Number(UserId)) return res.status(403).json({ status: 'error', message: '此帳戶已經有人使用' })
            if (emailUser && Number(emailUser.dataValues.id) !== Number(UserId)) return res.status(403).json({ status: 'error', message: '此信箱已經有人使用，請更換其他信箱' })
            const newPassword = bcrypt.hashSync(password, 10)
            return user.update({
              name,
              account: account || user.dataValues.account,
              email: email || user.dataValues.email,
              password: newPassword || user.dataValues.password
            })
              .then(user => {
                res.json({ status: '更新成功', user })
              })
          })
      } else {
        // 有多個圖檔那頁
        const { files } = req
        return Promise.all([
          User.findByPk(UserId),
          imgurCoverHandler(files),
          imgurAvatarHandler(files)
        ])
          .then(([user, coverUrl, avatarUrl]) => user.update({
            name,
            introduction: introduction || user.dataValues.introduction,
            cover: coverUrl || user.cover,
            avatar: avatarUrl || user.avatar
          }))
          .then(user => {
            res.json({ status: '更新成功', user })
          })
      }
    } catch (err) {
      next(err)
    }
  },
  getTopUsers: (req, res, next) => {
    try {
      User.findAll({
        attributes: { exclude: ['password'] },
        include: [{ model: User, as: 'Followers', attributes: { exclude: ['password'] } }],
        nest: true
      })
        .then(user => {
          let newData = []
          // eslint-disable-next-line array-callback-return
          user.map(user => {
            user = user.toJSON()
            if (user.role === 'admin' || user.id === req.user.dataValues.id) {
              return false
            } else if (user.Followers.some(follower =>
              follower.Followship.followerId === req.user.dataValues.id)) {
              return newData.push({ ...user, isFollowed: true })
            } else {
              return newData.push({ ...user, isFollowed: false })
            }
          })
          newData.sort((a, b) => b.Followers.length - a.Followers.length)
          if (newData.length > 10) {
            newData = newData.slice(0, 10)
          }
          res.json({
            data: newData
          })
        })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
