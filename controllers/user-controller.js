const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const { User, Tweet, Reply, Like } = require('../models')
const sequelize = require('sequelize')
const { Op } = require("sequelize");
const helpers = require('../_helpers')
const { validateData, validateUser, validateUnique, validateEqual } = require('../vaildate-function')

const imgur = require('imgur')
imgur.setClientId(process.env.IMGUR_CLIENT_ID)

const userController = {
  signIn: (req, res, next) => {
    // POST /api/users/signin - 使用者登入
    const { account, password } = validateData(req.body)

    return User.findOne({ where: { account } })
      .then(user => {
        validateUser(user, password)

        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
        res.status(200).json({
          status: 'success',
          data: {
            token,
            user: userData
          }
        })
      })
      .catch(err => next(err))
  },
  postUser: (req, res, next) => {
    // POST /api/users - 註冊新使用者帳戶
    const { account, name, email, password } = validateData(req.body)

    return User.findAll({
      where:
        { [Op.or]: [{ account }, { email }] }
    })
      .then(users => {
        const UniqueData = {
          account,
          email
        }
        validateUnique(users, UniqueData)

        return User.create({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        })

      })
      .then(user => res.status(200).json({
        status: 'success',
        data: {
          user: user.toJSON()
        }
      })).catch(err => next(err))
  },
  putUserAccount: (req, res, next) => {
    // PUT /api/user/:id/account - 編輯註冊資料
    const { id } = req.params
    const currentUser = helpers.getUser(req)
    if (id !== String(currentUser.id)) throw new Error('permission denied')
    const data = validateData(req.body)
    const { account, name, email, password } = data

    return User.findAll({ where: { [Op.or]: [{ account }, { email }] } })
      .then(users => {
        const Unique = {
          currentUser,
          account,
          email
        }
        validateEqual(users, data)
        validateUnique(users, Unique)
        

        return User.update({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        }, {
          where: { id }, returning: true,
          plain: true
        })
      }).then(() => res.status(200).json({
        status: 'success',
        message: 'change succeeded !'
      }))
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    // GET /api/users/:user_id - 檢視特定使用者的資訊
    const currentUser = helpers.getUser(req).dataValues
    const { id } = req.params
    return User.findByPk(id, {
      include:
        [{
          model: User,
          as: 'Followings',
          attributes: ['id']
        },
        {
          model: User,
          as: 'Followers',
          attributes: ['id']
        },
        {
          model: Tweet,
          attributes: ['id']
        }
        ]
    })
      .then(user => {
        validateUser(user)
        user = {
          ...user.toJSON(),
          tweetCount: user.Tweets?.length,
          followerCount: user.Followers?.length,
          followingCount: user.Followings?.length,
          isFollowed: user.Followers?.some(u => u.id === currentUser.id)
        }

        delete user.password
        delete user.Tweets
        delete user.Followers
        res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    // GET /api/users/:user_id/tweets - 檢視特定使用者的所有推文
    const UserId = req.params.id
    console.log(UserId)
    User.findByPk(UserId)
      .then(user => {
        validateUser(user)
      }).catch(err => next(err))

    return Tweet.findAll({
      where: { UserId },
      attributes: ['id', 'description', 'createdAt'],
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'], as: 'tweetAuthor' }, { model: Reply, attributes: ['id'] }, { model: Like, attributes: ['UserId'] }]
    })
      .then(tweets => {
        const currentUser = helpers.getUser(req)
        tweets.forEach(tweet => {
          tweet = tweet.dataValues
          tweet.replyCounts = tweet.Replies?.length,
            tweet.likeCounts = tweet.Likes?.length,
            tweet.isLiked = tweet.Likes?.some(l => l.UserId === currentUser.id)
          delete tweet.Replies
          delete tweet.Likes
        })
        res.status(200).json(tweets)
      }).catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    // GET /api/users/:user_id/replied_tweets - 檢視使用者發布過的所有回覆
    const UserId = req.params.id

    User.findByPk(UserId)
      .then(user => {
        validateUser(user)
      }).catch(err => next(err))

    return Reply.findAll({
      where: { UserId },
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'], foreignKey: 'UserId', as: 'replyUser' },
      { model: Tweet, attributes: ['id', 'description'], include: [{ model: User, attributes: ['id', 'account'], as: 'tweetAuthor' }] }]
    })
      .then(replies => {
        replies = replies.filter(reply => {
          if (!(reply.Tweet === null)) return reply
        })

        replies?.forEach(reply => {
          console.log(reply)
          reply = reply?.dataValues
          reply.tweetAuthorAccount = reply?.Tweet?.tweetAuthor?.account
          delete reply?.Tweet?.dataValues?.tweetAuthor
        })

        res.status(200).json(replies)
      }).catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {
    // GET /api/users/:user_id/likes - 檢視使用 like 過的所有推文
    const UserId = req.params.id
    User.findByPk(UserId)
      .then(user => {
        validateUser(user)
      }).catch(err => next(err))

    return Like.findAll({
      where: { UserId },
      order: [['createdAt', 'DESC']],
      attributes: ['TweetId'],
      include: [{
        model: Tweet,
        attributes:
          ['id', 'description', 'createdAt'],
        include: [{
          model: User,
          attributes:
            ['id', 'account', 'name',
              'avatar'], as: 'tweetAuthor'
        }, { model: Reply }, { model: Like }]
      }]
    })
      .then(likes => {
        const currentUser = helpers.getUser(req)
        likes = likes.filter(like => {
          if (!(like.Tweet === null)) return like
        })

        likes = likes?.map(like => {
          like = like?.toJSON()
          like.replyCounts = like?.Tweet?.Replies?.length,
            like.likeCounts = like?.Tweet?.Likes?.length,
            like.isLiked = like?.Tweet?.Likes.some(l => l.UserId === currentUser.id)
          delete like?.Tweet?.Replies
          delete like?.Tweet?.Likes
          return like
        })
        return res.status(200).json(likes)
      })
      .catch(err => next(err))
  },
  getUserFollowers: (req, res, next) => {
    // GET /api/users/:user_id/followers - 檢視使用者的跟隨者
    const UserId = req.params.id
    return User.findByPk(UserId, {
      attributes: ['id',
        'name',
        'account',
        'avatar',
        'introduction'],
      include:
        [{
          model: User,
          as: 'Followers',
          attributes: ['id',
            'name',
            'account',
            'avatar',
            'introduction']
        }]
    })
      .then(user => {
        validateUser(user)

        const userFollowings = helpers.getUser(req).Followings.map(user => user.id)
        const followers = user.toJSON().Followers

        followers.forEach(data => {
          data.followerId = data.Followship.followerId
          data.isFollowed = userFollowings.some(id => id === data.id)
          data.followCreatAt = data.Followship.createdAt
          delete data.Followship
        })
        followers.sort((a, b) => b.followCreatAt - a.followCreatAt)
        
        res.status(200).json(followers)
      }).catch(err => next(err))
  },
  getUserFollowings: (req, res, next) => {
    // GET /api/users/:user_id/followings - 檢視使用的跟隨中的用戶
    const UserId = req.params.id
    return User.findByPk(UserId, {
      attributes: ['id',
        'name',
        'account',
        'avatar',
        'introduction'],
      include:
        [{
          model: User,
          as: 'Followings',
          attributes: ['id',
            'name',
            'account',
            'avatar',
            'introduction']
        }]
    })
      .then(user => {
        validateUser(user)

        const userFollowings = helpers.getUser(req).Followings.map(user => user.id)

        const followings = user.toJSON().Followings

        followings.forEach(data => {
          data.followingId = data.Followship?.followingId
          data.isFollowed = userFollowings?.some(id => id === data.id)
          data.followCreatAt = data?.Followship?.createdAt,
          delete data.Followship
        })
        followings.sort((a, b) => b.followCreatAt - a.followCreatAt)

        res.status(200).json(followings)
      }).catch(err => next(err))
  },
  getPopularUsers: (req, res, next) => {
    // GET /api/users/popularUsers - 檢視十大熱門使用者
    const currentUser = helpers.getUser(req)
    return User.findAll({
      include: {
        model: User, as: 'Followers', attributes: ['id']
      },
      attributes: ['id',
        'name',
        'avatar',
        'account'],
      where: { role: 'user' }
    })
      .then(users => {
        const popularUser = users.map(user => {
          user = user.toJSON()
          user.followerCounts = user.Followers?.length
          user.isFollowed = user.Followers?.some(u => u.id === currentUser.id)
          delete user.Followers
          return user
        })
        popularUser.sort((a, b) => b.followerCounts - a.followerCounts).splice(10)

        res.status(200).json(popularUser)
      }).catch(err => next(err))
  },
  putUser: (req, res, next) => {
    // PUT /api/users/:user_id - 編輯個人資料
    const id = Number(req.params.id)
    const currentUser = helpers.getUser(req).id

    if (id !== currentUser) throw new Error('permission denied')
    const { name, introduction } = validateData(req.body)

    const { files } = req
    if (!files) {
      return User.update({ name, introduction }, { where: { id } })
        .then(user => {
          res.status(200).json(user)
        })
        .catch(err => next(err))
    }

    const uploadFiles = {}

    Promise.all(Array.from(Object.keys(files), (key, index) => {
      return imgur.uploadFile(files[key][0]?.path)
        .then(uploadFile => {
          uploadFiles[key] = uploadFile?.link || null
        })
        .catch(err => next(err))
    }))
      .then(() => {
        return User.findByPk(id)
      })
      .then((user) => {
        validateUser(user)
        return user.update({
          name,
          introduction,
          avatar: uploadFiles?.avatar || user.avatar,
          backgroundImage: uploadFiles?.backgroundImage || user.backgroundImage
        })
      })
      .then(updatedUser => res.status(200).json(updatedUser.toJSON()
      ))
      .catch(err => next(err))
  },
  getCurrentUser: (req, res) => {
    const currentUser = helpers.getUser(req).toJSON()
    delete currentUser.password
    delete currentUser.Followings
    res.status(200).json(currentUser)
  }

}

module.exports = userController
