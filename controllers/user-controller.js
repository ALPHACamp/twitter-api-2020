const jwt = require('jsonwebtoken')
const { Tweet, User, Like, Reply, sequelize } = require('../models')
const bcrypt = require('bcryptjs')
const passport = require('../config/passport')
const { getUser } = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  login: (req, res, next) => {
    passport.authenticate('local', { session: false, failWithError: true }, (err, user, info) => {
      // err: null & user: false => 400
      if (!err && !user) {
        const error = new Error('輸入資料不可為空值!')
        error.status = 400
        return next(error)
      }

      if (err || !user) {
        if (err.status === 401) {
          return next(err)
        }
      }
      if (user.role !== 'user') {
        const error = new Error('驗證失敗!')
        error.status = 401
        return next(error)
      }
      try {
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
        res.json({
          token,
          user: { id: userData.id }
        })
      } catch (err) {
        return next(err)
      }
    })(req, res, next)
  },
  signUp: (req, res, next) => {
    if (!req.body.email.trim() || !req.body.account.trim() || !req.body.name.trim() || !req.body.password.trim() || !req.body.checkPassword.trim()) {
      const error = new Error('輸入資料不可為空值!')
      error.status = 400
      throw error
    }

    if (req.body.password !== req.body.checkPassword) {
      const error = new Error('密碼輸入不相符！')
      error.status = 403
      throw error
    }

    User.findOne({ where: { account: req.body.account } })
      .then(user => {
        if (user) {
          const error = new Error('account 已重複註冊！')
          error.status = 403
          throw error
        }

        return bcrypt.hash(req.body.password, 10)
      })
      .catch(err => next(err))

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) {
          const error = new Error('email 已重複註冊！')
          error.status = 403
          throw error
        }

        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(user => {
        res.json({
          status: 'success'
        })
      })
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet }
      ]
    })
      .then(user => {
        if (!user) {
          const error = new Error('此使用者不存在!')
          error.status = 404
          throw error
        }
        return user
      })
      .then(user => {
        const userData = user.toJSON()
        // count followers and following
        userData.followerCounts = userData.Followers.length
        userData.followingCounts = userData.Followings.length
        userData.tweetCounts = userData.Tweets.length
        userData.isFollowed = userData.Followers?.some(follower => follower.id === getUser(req).dataValues.id)
        userData.isCurrentUser = getUser(req).dataValues.id === user.id
        // delete unused properties
        delete userData.password
        delete userData.Followers
        delete userData.Followings

        res.json(userData)
      })
      .catch(err => next(err))
  },
  putUserSetting: (req, res, next) => {
    const { id } = req.params
    if (Number(id) !== Number(getUser(req).dataValues.id)) {
      const error = new Error('只能修改自己的資料!')
      error.status = 403
      throw error
    }
    const { name, account, email, password, checkPassword } = req.body
    if (!name.trim() || !account.trim() || !email.trim()) {
      const error = new Error('輸入資料不可為空值!')
      error.status = 400
      throw error
    }
    if ((password || checkPassword) && password !== checkPassword) {
      const error = new Error('密碼輸入不相符!')
      error.status = 403
      throw error
    }
    return Promise.all([
      User.findByPk(id),
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(async ([theUser, findAccount, findEmail]) => {
        if (findAccount && Number(findAccount.id) !== Number(id)) {
          const error = new Error('account 已重複註冊！')
          error.status = 403
          throw error
        }
        if (findEmail && Number(findEmail.id) !== Number(id)) {
          const error = new Error('email 已重複註冊！')
          error.status = 403
          throw error
        }
        return theUser.update({
          name,
          account,
          email,
          password: password ? await bcrypt.hash(password, 10) : theUser.password
        })
      })
      .then(updateUser => {
        const data = updateUser.toJSON();
        ['role', 'avatar', 'coverPage', 'password', 'introduction'].forEach(e => delete data[e])
        res.status(200).json({ status: 'success', data })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    if (Number(req.params.id) !== Number(getUser(req).dataValues.id)) {
      const error = new Error('只能修改自己的資料!')
      error.status = 403
      throw error
    }
    const { name, introduction } = req.body
    if (!name.trim()) {
      const error = new Error('輸入資料不可為空值!')
      error.status = 400
      throw error
    }
    if (introduction.length > 160) {
      const error = new Error('自我介紹數字上限 160 字!')
      error.status = 400
      throw error
    }
    if (name.length > 50) {
      const error = new Error('暱稱上限 50 字！')
      error.status = 400
      throw error
    }

    const avatar = req.files ? req.files.avatar : undefined
    const coverPage = req.files ? req.files.coverPage : undefined

    User.findByPk(req.params.id).then(user => {
      if (!user) {
        const error = new Error('此使用者不存在!')
        error.status = 404
        throw error
      }
      return user
    })
      .then(async user => {
        const avatarFilePath = avatar ? await imgurFileHandler(avatar[0]) : user.avatar
        const coverPageFilePath = coverPage ? await imgurFileHandler(coverPage[0]) : user.coverPage
        return user.update({
          name,
          introduction,
          avatar: avatarFilePath,
          coverPage: coverPageFilePath
        })
      })
      .then(updatedUser => {
        const { id, name, introduction, avatar, coverPage } = updatedUser.toJSON()
        res.status(200).json({
          id, name, introduction, avatar, coverPage
        })
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    User.findByPk(req.params.id).then(user => {
      if (!user) {
        const error = new Error('此使用者不存在!')
        error.status = 404
        throw error
      }
    })
      .then(() => {
        return Tweet.findAll({
          where: {
            UserId: req.params.id
          },
          raw: true,
          nest: true,
          order: [['createdAt', 'DESC']],
          attributes: {
            exclude: ['UserId'],
            include: [
              [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likeCounts'],
              [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCounts'],
              [sequelize.literal(`(SELECT COUNT(*) = 1 FROM Likes WHERE Likes.User_id = ${getUser(req).dataValues.id} AND Likes.Tweet_id = Tweet.id)`), 'isLiked']
            ]
          },
          include: [
            {
              model: User,
              attributes: ['id', 'avatar', 'name', 'account']
            }
          ]
        })
      })
      .then(tweets => {
        const resultTweets = tweets.map(tweet => ({
          ...tweet,
          isLiked: Boolean(tweet.isLiked)
        }))
        return res.status(200).json(resultTweets)
      }).catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    User.findByPk(req.params.id)
      .then(user => {
        if (!user) {
          const error = new Error('此使用者不存在!')
          error.status = 404
          throw error
        }
      })
      .then(() => {
        return Reply.findAll({
          where: {
            UserId: req.params.id
          },
          raw: true,
          nest: true,
          order: [['createdAt', 'DESC']],
          attributes: {
            exclude: ['UserId', 'TweetId']
          },
          include: [
            {
              model: User,
              attributes: ['id', 'avatar', 'name', 'account']
            },
            {
              model: Tweet,
              attributes: ['id'],
              include: [{ model: User, attributes: ['account'] }]
            }
          ]
        })
      })
      .then(replies => {
        return res.status(200).json(replies)
      })
      .catch(err => next(err))
  },
  getUserFollowings: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'Followings',
            attributes: ['id', 'name', 'avatar', 'introduction']
          }
        ]
      }),
      User.findByPk(getUser(req).dataValues.id, {
        attributes: ['id'],
        include: [
          { model: User, as: 'Followings', attributes: ['id'] }
        ]
      })
    ])
      .then(([targetUser, currentUser]) => {
        if (!targetUser) {
          const error = new Error('此使用者不存在!')
          error.status = 404
          throw error
        }
        const followings = targetUser.toJSON().Followings.map(following => ({
          createdAt: following.Followship.createdAt,
          followingId: following.id,
          name: following.name,
          avatar: following.avatar,
          introduction: following.introduction,
          isFollowed: currentUser.toJSON().Followings.some(currentUserfollowing => currentUserfollowing.id === following.id),
          isCurrentUser: following.id === getUser(req).dataValues.id
        }))
          .sort((a, b) => (new Date(b.createdAt)).getTime() - (new Date(a.createdAt)).getTime())

        return res.json(followings)
      })
      .catch(err => next(err))
  },
  getUserFollowers: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'Followers',
            attributes: ['id', 'name', 'avatar', 'introduction']
          }
        ]
      }),
      User.findByPk(getUser(req).dataValues.id, {
        attributes: ['id'],
        include: [
          { model: User, as: 'Followers', attributes: ['id'] }
        ]
      })
    ])
      .then(([targetUser, currentUser]) => {
        if (!targetUser) {
          const error = new Error('此使用者不存在!')
          error.status = 404
          throw error
        }
        const followers = targetUser.toJSON().Followers.map(follower => ({
          createdAt: follower.Followship.createdAt,
          followerId: follower.id,
          name: follower.name,
          avatar: follower.avatar,
          introduction: follower.introduction,
          isFollowed: currentUser.toJSON().Followers.some(currentUserfollower => currentUserfollower.id === follower.id),
          isCurrentUser: follower.id === getUser(req).dataValues.id
        }))
          .sort((a, b) => (new Date(b.createdAt)).getTime() - (new Date(a.createdAt)).getTime())

        return res.json(followers)
      })
      .catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {
    User.findByPk(req.params.id).then(user => {
      if (!user) {
        const error = new Error('此使用者不存在!')
        error.status = 404
        throw error
      }
    })
      .then(() => {
        Promise.all([
          Like.findAll({
            where: {
              UserId: req.params.id
            },
            raw: true,
            nest: true,
            order: [['createdAt', 'DESC']],
            attributes: {
              exclude: ['UserId'],
              include: [
                [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likeCounts'],
                [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCounts']
              ]
            },
            include: [
              {
                model: Tweet,
                attributes: ['id', 'description', 'createdAt', 'updatedAt'],
                include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }]
              }
            ]
          }),
          Like.findAll({
            where: {
              UserId: getUser(req).dataValues.id
            },
            raw: true,
            attributes: ['Tweet_id']
          })
        ])
          .then(([targetUserLikes, currentUserLikes]) => {
            const likes = targetUserLikes.map(like => ({
              ...like,
              isLiked: currentUserLikes.some(currentUserLike => currentUserLike.Tweet_id === like.TweetId)
            }))
            return res.status(200).json(likes)
          })
      }).catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    User.findAll({
      where: {
        role: 'user'
      },
      attributes: ['id', 'name', 'account', 'avatar'],
      include: [
        { model: User, as: 'Followers', attributes: ['id'] },
        { model: User, as: 'Followings', attributes: ['id'] }
      ]
    })
      .then(users => {
        const userData = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: getUser(req).dataValues.Followings.some(f => f.id === user.id),
            isCurrentUser: getUser(req).dataValues.id === user.id
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
          .slice(0, 10)

        res.json(userData)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
