const db = require('../models')
const { User, Tweet, Like, Reply, Followship, Sequelize } = db
const { Op } = Sequelize
const RequestError = require('../libs/RequestError')
const bcrypt = require('bcryptjs')

const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const jwt = require('jsonwebtoken')

const userService = {
  signUp: (body) => {
    let { name, email, account, password, checkPassword } = body
    const errors = []
    let errorMsg = ''

    const isFieldsAbsence = !name || !account || !email || !password || !checkPassword
    const isPasswordUnequalCheckPassword = checkPassword !== password

    if (isFieldsAbsence || isPasswordUnequalCheckPassword) {
      if (isFieldsAbsence) {
        errors.push('每個欄位都是必要欄位')
      }

      if (isPasswordUnequalCheckPassword) {
        errors.push('兩次密碼輸入不同')
      }

      errorMsg = errors.join(',')

      throw new RequestError(errorMsg)
    } else {
      account = account.replace(/^[@]*/, '')

      return User.findOne({
        where: {
          [Op.or]: [
            { email: email },
            { account: account }
          ]
        }
      }).then(user => {
        if (user) {
          if (user.email === email) {
            errors.push('信箱重複')
          }
          if (user.account === account) {
            errors.push('帳號重複')
          }

          errorMsg = errors.join(',')

          throw new RequestError(errorMsg)
        } else {
          User.create({
            account: account,
            name: name,
            email: email,
            role: 'user',
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            return { status: 'success', message: '成功註冊帳號！' }
          })
        }
      })
    }
  },
  login: (body) => {
    const { account, password } = body
    if (!account || !password) {
      throw new RequestError('Required fields missing')
    }

    return User.findOne({ where: { account: account } })
      .then(user => {
        if (!user) { throw new RequestError('no such user found') }
        if (!bcrypt.compareSync(password, user.password)) {
          throw new RequestError('Passwords did not match')
        }
        const payload = { id: user.id, role: user.role }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        return {
          token: token,
          user: {
            id: user.id, name: user.name, email: user.email, account: user.account, avatar: user.avatar, isAdmin: Boolean(user.role === 'admin')
          }
        }
      })
  },
  getUser: (viewerRole, UserId, currentUser) => {
    let attributesOption = []
    switch (currentUser) {
      case 'currentUser':
        attributesOption = [
          'id', 'name', 'account', 'email', 'avatar', [Sequelize.literal(`exists (SELECT * FROM users WHERE role = 'admin' and id = '${UserId}')`), 'isAdmin']
        ]
        break
      case 'user':
        attributesOption = ['id', 'name', 'account', 'avatar', 'cover', 'introduction', 'followerCount', 'followingCount']
    }
    return User.findByPk(UserId, { attributes: attributesOption })
      .then(user => {
        if (!user) {
          throw new RequestError('User not found.')
        }
        if (currentUser === 'currentUser') {
          user.dataValues.isAdmin = Boolean(user.dataValues.isAdmin)
        }
        const { id, name, account, email, avatar, cover, introduction, followerCount, followingCount } = user
        const isAdmin = user.dataValues.isAdmin
        return {
          id, name, account, email, avatar, cover, introduction, followerCount, followingCount, isAdmin
        }
      })
  },
  getUserTweets: (viewerRole, UserId, viewerId) => {
    let attributesOption = []

    switch (viewerRole) {
      case 'user':
        attributesOption = [
          ['id', 'TweetId'],
          'description', 'createdAt', 'replyCount', 'likeCount',
          [Sequelize.literal(`exists (select * from Likes where Likes.UserId = '${viewerId}' and Likes.TweetId = Tweet.id)`), 'isLike']
        ]
        break

      case 'admin':
        attributesOption = [
          ['id', 'TweetId'],
          'description', 'createdAt', 'replyCount', 'likeCount'
        ]
        break
    }

    return User.findByPk(UserId)
      .then(user => {
        if (!user) {
          throw new RequestError('This user does not exist.')
        }
        return Tweet.findAll({
          where: { UserId },
          attributes: attributesOption,
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'account', 'avatar']
            },
            {
              model: Like, attributes: []
            }
          ],
          order: [['createdAt', 'DESC']]
        }).then(tweets => {
          if (viewerRole === 'user') {
            tweets.forEach(tweet => {
              tweet.dataValues.isLike = Boolean(tweet.dataValues.isLike)
            })
          }
          return tweets
        })
      })
  },
  getUserLikes: (viewerRole, UserId, viewerId) => {
    return User.findByPk(UserId)
      .then(user => {
        if (!user) {
          throw new RequestError('This user does not exist.')
        }
      }).then(user => {
        return Like.findAll({
          include: [
            {
              model: Tweet,
              attributes: ['id', 'description', 'createdAt', 'replyCount', 'likeCount']
            },
            {
              model: User,
              attributes: ['id', 'name', 'account', 'avatar']
            }
          ],
          where: { UserId },
          attributes: ['TweetId'],
          order: [
            ['createdAt', 'DESC']
          ]
        }).then(likes => {
          likes = likes.map((like, i) => {
            const userObj = {
              ...like.User.dataValues
            }

            const mapItem = {
              ...like.dataValues,
              ...like.Tweet.dataValues,
              isLike: like.User.id === viewerId
            }

            delete mapItem.Tweet
            delete mapItem.id
            delete mapItem.User

            mapItem.User = userObj

            if (viewerRole === 'admin') {
              delete mapItem.isLike
            }

            return mapItem
          })

          return likes
        })
      })
  },
  getUserFollowings: (viewerRole, UserId, viewerId) => {
    return User.findByPk(UserId)
      .then(user => {
        if (!user) {
          throw new RequestError('This user does not exist.')
        }
      }).then(user => {
        return User.findAll({
          include: [
            {
              model: User,
              as: 'Followings',
              attributes: ['id', 'name', 'account', 'avatar', 'introduction'],
              nest: true,

              include: {
                model: User,
                as: 'Followers',
                attributes: ['id'],
                where: { id: viewerId },
                nest: true,
                required: false
              }
            }
          ],
          where: { id: UserId },
          attributes: [],
          nest: true,
          raw: true,
          order: [[{ model: User, as: 'Followings' }, 'createdAt', 'DESC']]
        }).then(async data => {
          data = data.map((item, i) => {
            const mapItem = {
              ...item.dataValues,
              followingId: item.Followings.id,
              Followings: {
                ...item.Followings,
                isFollowing: Boolean(item.Followings.Followers.id)
              }
            }
            delete mapItem.Followings.Followship
            delete mapItem.Followings.Followers.Followship
            delete mapItem.Followings.Followers

            if (viewerRole === 'admin') {
              delete mapItem.Followings.isFollowing
            }
            return mapItem
          })
          return data
        })
      })
  },
  getUserFollowers: (viewerRole, UserId, viewerId) => {
    return User.findByPk(UserId)
      .then(user => {
        if (!user) {
          throw new RequestError('This user does not exist.')
        }
      }).then(user => {
        return User.findAll({
          include: [
            {
              model: User,
              as: 'Followers',
              attributes: ['id', 'name', 'account', 'avatar', 'introduction'],
              nest: true,

              include: {
                model: User,
                as: 'Followers',
                attributes: ['id'],
                where: { id: viewerId },
                nest: true,
                required: false
              }
            }
          ],
          where: { id: UserId },
          attributes: [],
          nest: true,
          raw: true,
          order: [[{ model: User, as: 'Followers' }, 'createdAt', 'DESC']]
        }).then(async data => {
          data = data.map((item, i) => {
            const mapItem = {
              ...item.dataValues,
              followerId: item.Followers.id,
              Followers: {
                ...item.Followers,
                isFollowing: Boolean(item.Followers.Followers.id)
              }
            }
            delete mapItem.Followers.Followship
            delete mapItem.Followers.Followers.Followship
            delete mapItem.Followers.Followers

            if (viewerRole === 'admin') {
              delete mapItem.Followers.isFollowing
            }

            return mapItem
          })
          return data
        })
      })
  },
  getTopUsers: (viewerRole, viewerId) => {
    return User.findAll({
      include: {
        model: User,
        as: 'Followers',
        where: { id: viewerId },
        attributes: ['id'],
        required: false,
        nest: true
      },
      where: { role: { [Op.ne]: 'admin' } },
      attributes: ['id', 'name', 'account', 'avatar', 'introduction', 'followerCount'],
      order: [['followerCount', 'DESC']],
      limit: 10,
      nest: true,
      raw: true
    }).then(users => {
      users = users.map((item, i) => {
        const mapItem = {
          ...item,
          isFollowing: Boolean(item.Followers.id)
        }
        delete mapItem.Followers
        delete mapItem.followerCount
        return mapItem
      })
      return users
    })
  },
  putUser: (viewerRole, UserId, viewerId, body, files) => {
    if (Number(UserId) !== viewerId) {
      throw new RequestError('This is not this user\'s account.')
    }

    if (!body.name) {
      throw new RequestError('User name required.')
    }

    // TODO：改善重複上傳的問題
    if (files) {
      imgur.setClientId(IMGUR_CLIENT_ID)
      const avatar = files.avatar ? imgur.uploadFile((files.avatar[0].path)) : null
      const cover = files.cover ? imgur.uploadFile((files.cover[0].path)) : null

      Promise.all([avatar, cover])
        .then(images => {
          return User.findByPk(UserId)
            .then(user => {
              return user.update({
                name: body.name,
                introduction: body.introduction,
                avatar: files.avatar ? images[0].link : user.avatar,
                cover: files.cover ? images[1].link : user.cover
              })
            })
        })
    } else {
      return User.findByPk(UserId)
        .then((user) => {
          return user.update({
            name: body.name,
            introduction: body.introduction,
            avatar: user.avatar,
            cover: user.cover
          })
        })
    }
  },
  putUserSettings: (viewerRole, UserId, viewerId, body) => {
    const { account, name, email, password, checkPassword } = body
    if (Number(UserId) !== viewerId) {
      throw new RequestError('This is not this user\'s account.')
    }

    return User.findByPk(UserId)
      .then(user => {
        if (!user) {
          throw new RequestError('This user does not exist.')
        }
        if (!account || !name || !email || !password || !checkPassword) {
          throw new RequestError('Required fields missing.')
        }
        if (password !== checkPassword) {
          throw new RequestError('Password should be as same as checkPassword')
        }

        return user.update({
          account: account,
          name: name,
          email: email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        }).then(() => {
          return {
            status: 'success',
            message: 'User successfully updated.',
            user: { id: UserId }
          }
        }).catch(err => {
          throw new RequestError(err)
        })
      })
  },
  getUserRepliedTweets: (viewerRole, UserId, viewerId) => {
    return User.findByPk(UserId)
      .then(user => {
        if (!user) {
          throw new RequestError('This user does not exist.')
        }
      }).then(user => {
        return Reply.findAll({
          where: { UserId },
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
            {
              model: Tweet,
              attributes: ['id', 'description', 'replyCount', 'likeCount'],
              include: { model: Like, separate: true, where: { UserId: viewerId }, required: false }
            }
          ],
          attributes: ['id', 'comment'],
          nest: true,
          order: [[Reply.associations.Tweet, 'createdAt', 'DESC']]
        }).then(replies => {
          replies = replies.map((item, i) => {
            const userObj = {
              ...item.User.dataValues
            }

            const mapItem = {
              TweetId: item.dataValues.Tweet.dataValues.id,
              ...item.dataValues,
              ...item.dataValues.Tweet.dataValues,
              isLike: Boolean(item.Tweet.Likes[0])
            }
            delete mapItem.Tweet
            delete mapItem.Likes
            delete mapItem.id
            delete mapItem.User

            if (viewerRole === 'admin') {
              delete mapItem.isLike
            }

            mapItem.User = userObj

            return mapItem
          })
          return replies
        })
      })
  }
}

module.exports = userService
