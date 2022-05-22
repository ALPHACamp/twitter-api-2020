/* eslint-disable no-fallthrough */
const createToken = require('../helpers/token')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')
const { imgurCoverHandler, imgurAvatarHandler } = require('../helpers/file-helpers')
const tweetServices = require('../services/tweets')
const sequelize = require('sequelize')

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
  signUp: async (req, res, next) => {
    try {
      const { name, account, email, password, checkPassword } = req.body
      const errorMsg = []
      if (!name) errorMsg.push('名字')
      if (!account) errorMsg.push('帳號')
      if (!email) errorMsg.push('信箱')
      if (!password) errorMsg.push('密碼')
      if (errorMsg.length) {
        let message = `請輸入${errorMsg[0]}`
        for (let index = 1; index < errorMsg.length; index++) {
          if (index < errorMsg.length - 1) {
            message += `、${errorMsg[index]}`
          } else {
            message += `及${errorMsg[index]}`
          }
        }
        throw new Error(message)
      }
      if (password !== checkPassword) throw new Error('密碼與確認密碼不符，請重新輸入')
      const emailCheck = await User.findOne({ where: { email: req.body.email } })
      const accountCheck = await User.findOne({ where: { account: req.body.account } })
      if (emailCheck) throw new Error('此Email已被註冊！！')
      if (accountCheck) throw new Error('此帳號已被註冊！！')
      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({
        name,
        account,
        email,
        password: hash,
        role: 'user'
      })
      const user = await User.findOne({
        attributes: {
          exclude: ['password']
        },
        where: {
          account
        },
        raw: true
      })
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },
  getUser: (req, res, next) => {
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
        delete user.password
        res.json({
          status: 'success',
          ...user,
          tweetCount: user.Tweets.length,
          followingsCount: user.Followings.length,
          followersCount: user.Followers.length
        })
      })
      .catch(err => next(err))
  },
  getUserTweet: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
      const loginUserId = helpers.getUser(req).id
      const totaltweets = await tweetServices.getAll(loginUserId)
      if (!totaltweets) throw new Error('沒有推文！')
      const tweets = totaltweets.filter(element => element.UserId === userId)
      if (!tweets.length) throw new Error('使用者沒有推文！')
      res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  userRepliedTweets: (req, res, next) => {
    const UserId = req.params.id
    Reply.findAll({
      where: { UserId },
      include: [
        {
          model: Tweet,
          include: [
            { model: User },
            { model: Like, attributes: ['id'] },
            { model: Reply, attributes: ['id'] }
          ],
          attributes: { exclude: ['password'] }
        },
        { model: User, attributes: { exclude: ['password'] } }
      ],
      nest: true
    })
      .then(reply => {
        if (!reply[0]) {
          // return res.status(403).json({ status: 'error', message: '找不到使用者的回覆！' })
          throw new Error('找不到使用者的回覆！')
        }
        const repeatDataId = []
        const rawData = []
        // eslint-disable-next-line array-callback-return
        reply.forEach(reply => {
          reply = reply.toJSON()
          if (!repeatDataId.includes(reply.TweetId)) {
            repeatDataId.push(reply.TweetId)
            rawData.push(reply)
          } else {
            return false
          }
        })

        const data = rawData.map(element => ({
          avatar: element.Tweet.User.avatar,
          userName: element.User.name,
          userAccount: element.User.account,
          replyCreatedAt: element.createdAt,
          replyAccount: element.Tweet.User.account,
          comment: element.comment,
          totalLikeCount: element.Tweet.Likes.length,
          totalReplyCount: element.Tweet.Replies.length,
          UserId: element.User.id,
          replyId: element.id
        }))
        res.json(data)
      })
      .catch(err => next(err))
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

      if (!rawUserLikes.length) return res.status(204).json({ status: 'error', data: [], message: '使用者沒有喜歡的推文' })
      const likeTweetId = []
      rawUserLikes.forEach(element => {
        likeTweetId.push(element.Tweet.id)
      })
      const totaltweets = await tweetServices.getAll(helpers.getUser(req).id)
      const tweets = totaltweets.filter(element => likeTweetId.some(likeTweet => likeTweet === element.TweetId))
      res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  userFollowings: (req, res, next) => {
    const id = Number(req.params.id)
    User.findAll({
      attributes: { exclude: ['password'] },
      where: { id },
      include: [
        {
          model: User,
          as: 'Followings',
          include: [{ model: User, as: 'Followers', attributes: ['id'] }],
          attributes: ['id', 'account', 'name', 'avatar', 'introduction']
        }
      ],
      nest: true
    })
      .then(followingUsers => {
        if (!followingUsers[0]) throw new Error('沒有跟隨中的使用者')
        followingUsers = followingUsers[0].toJSON()
        const newData = []
        followingUsers.Followings.forEach(user => {
          newData.push({
            id: user.id,
            account: user.account,
            name: user.name,
            avatar: user.avatar,
            introduction: user.introduction,
            followingId: user.Followship.followingId,
            followerId: user.Followship.followerId,
            isFollowed: user.Followers.some(follower => follower.Followship.followerId === req.user.dataValues.id)
          })
        })
        res.json(newData)
      })
      .catch(err => next(err))
  },
  userFollowers: (req, res, next) => {
    const id = req.params.id
    User.findAll({
      where: { id },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: User,
          as: 'Followers',
          attributes: ['id', 'account', 'name', 'avatar', 'introduction'],
          include: [{ model: User, as: 'Followers', attributes: ['id'] }]
        }
      ],
      nest: true
    })
      .then(followerUsers => {
        if (!followerUsers[0]) throw new Error('沒有追隨中的使用者')
        const newData = []
        const followingsJsonData = followerUsers[0].toJSON()
<<<<<<< HEAD
=======
        // eslint-disable-next-line array-callback-return
>>>>>>> f8829ddb60b2f9d2055368d3a7314da8a6a39382
        followingsJsonData.Followers.forEach(follower => {
          newData.push({
            id: follower.id,
            account: follower.account,
            name: follower.name,
            avatar: follower.avatar,
            introduction: follower.introduction,
            followingId: follower.Followship.followingId,
            followerId: follower.Followship.followerId,
            isFollowed: follower.Followers.some(follower => follower.Followship.followerId === req.user.dataValues.id)
          })
        })
        res.json(newData)
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
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
          if (!user) throw new Error('使用者不存在！')
          if (accountUser && Number(accountUser.dataValues.id) !== Number(UserId)) throw new Error('此帳戶已經有人使用')
          if (emailUser && Number(emailUser.dataValues.id) !== Number(UserId)) throw new Error('此信箱已經有人使用，請更換其他信箱')
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
            .catch(err => next(err))
        })
        .catch(err => next(err))
    } else {
      // 有多個圖檔那頁
      const { files } = req
      return Promise.all([
        User.findByPk(UserId),
        imgurCoverHandler(files),
        imgurAvatarHandler(files)
      ])
        .then(([user, coverUrl, avatarUrl]) => {
          if (!user) throw new Error('使用者不存在！')
          return user.update({
            name,
            introduction: introduction || user.dataValues.introduction,
            cover: coverUrl || user.dataValues.cover,
            avatar: avatarUrl || user.dataValues.avatar
          })
        })
        .then(user => {
          res.json({ status: '更新成功', user })
        })
        .catch(err => next(err))
    }
  },
  getTopUsers: (req, res, next) => {
    Followship.findAll({
      attributes: [
        'followerId',
        [sequelize.fn('COUNT', sequelize.col('follower_id')), 'followerCounts']
      ],
      group: ['follower_id'],
      order: [[sequelize.literal('followerCounts'), 'DESC']],
      limit: 11,
      nest: true,
      raw: true
    })
      .then(top11FollowerId => {
        const usersId = []
        top11FollowerId.forEach(follower => {
          if (follower.followerId !== req.user.dataValues.id && usersId.length !== 10) usersId.push(follower.followerId)
        })
        User.findAll({
          where: { id: [...usersId] },
          attributes: ['id', 'account', 'name', 'avatar'],
          include: [
            { model: User, as: 'Followers', attributes: ['id'] }
          ],
          order: sequelize.literal(`Field(User.id,${usersId})`),
          nest: true
        })
          .then(top10Users => {
            const newData = top10Users.map(user => {
              user = user.toJSON()
              return ({
                id: user.id,
                account: user.account,
                name: user.name,
                avatar: user.avatar,
                isFollowed: user.Followers.some(followers => followers.Followship.followerId === req.user.dataValues.id)
              })
            })
            res.json(newData)
          })
          .catch(err => next(err))
      })
      .catch(err => next(err))
  }
}

module.exports = userController
