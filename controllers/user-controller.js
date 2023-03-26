const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Followship, Tweet, Reply, Like } = db
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body

    if (password !== checkPassword) throw new Error('Password do not match!')
    if (name.length > 50) throw new Error("name can't over 50 letters")

    User.findOne({ where: { [Op.or]: [{ account }, { email }] } })
      .then(user => {
        if (user) throw new Error('account or email already exists!')

        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash
      }))
      .then(() => res.json({
        status: 'success'
      }))
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()

      if (userData.role !== 'user') throw new Error('Account or password is wrong!')

      const authToken = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })

      delete userData.password
      delete userData.role

      res.json({
        status: 'success',
        authToken,
        user: {
          ...userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  addFollowing: (req, res, next) => {
    const user = helpers.getUser(req)
    const followerId = user.id
    const followingId = Number(req.body.id)

    return Promise.all([
      User.findAll({
        raw: true,
        attributes: ['id']
      }),
      Followship.findOne({ where: { [Op.and]: [{ followerId }, { followingId }] } })
    ])
      .then(([users, followship]) => {
        if (!users.some(user => user.id === followingId)) throw new Error("User didn't exist!")
        if (followship) throw new Error('You have followed this user!')
        if (followerId === followingId) throw new Error("You can't follow yourself!")

        return Followship.create({
          followerId,
          followingId
        })
          .then(followship => { res.json({ followship }) })
      })
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const user = helpers.getUser(req)
    const followerId = user.id
    const followingId = Number(req.params.followingId)

    return Promise.all([
      User.findAll({
        raw: true,
        attributes: ['id']
      }),
      Followship.findOne({ where: { [Op.and]: [{ followerId }, { followingId }] } })
    ])
      .then(([users, followship]) => {
        if (!users.some(user => user.id === followingId)) throw new Error("User didn't exist!")
        if (!followship) throw new Error("You didn't follow this user!")

        return followship.destroy()
      })
      .then(followship => {
        res.json({ followship })
      })
      .catch(err => next(err))
  },
  getTopFollow: (req, res, next) => {
    const user = helpers.getUser(req)
    const userId = Number(user.id)

    return User.findAll({
      where: { role: 'user' },
      attributes: ['id', 'account', 'name', 'avatar'],
      include: [{
        model: User,
        as: 'Followers',
        attributes: ['id']
      }]
    })
      .then(users => {
        const topUsers = users.map(user => {
          const userData = {
            ...user.toJSON(),
            followerCounts: user.Followers.length,
            isFollowed: user.Followers.some(follower => follower.id === userId)
          }
          delete userData.Followers
          return userData
        })
        res.json({
          topUsers: topUsers.sort((a, b) => b.followerCounts - a.followerCounts).slice(0, 10)
        })
      })
      .catch(err => next(err))
  },
  getUserProfile: (req, res, next) => {
    const { id } = req.params
    const user = helpers.getUser(req)
    const userId = Number(user.id)

    return User.findByPk(id, {
      include: [
        { model: User, as: 'Followings', attributes: ['id'] },
        { model: User, as: 'Followers', attributes: ['id'] }
      ]
    })
      .then(user => {
        if (!user) throw new Error("This User didn't exists!")

        const userProfile = {
          ...user.toJSON(),
          followerCounts: user.Followers.length,
          followingCounts: user.Followings.length,
          isFollowed: user.Followers.some(follower => follower.id === userId)
        }
        delete userProfile.Followers
        delete userProfile.Followings
        delete userProfile.password
        delete userProfile.role

        return res.json(userProfile)
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    const { id } = req.params
    const user = helpers.getUser(req)
    const userId = Number(user.id)

    return Promise.all([
      Tweet.findAll({
        where: { UserId: id },
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['UserId'] }
        ]
      }),
      User.findByPk(id)
    ])
      .then(([tweets, user]) => {
        if (!tweets) throw new Error('There is no any tweet exists')
        if (!user) throw new Error("This User didn't exists!")

        const userTweets = tweets.map(tweet => {
          const data = {
            ...tweet.toJSON(),
            replyCounts: tweet.Replies.length,
            likeCounts: tweet.Likes.length,
            isLiked: tweet.Likes.some(like => like.UserId === userId)
          }
          delete data.Replies
          delete data.Likes

          return data
        })

        res.json(userTweets)
      })
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    const { id } = req.params

    return Promise.all([
      Reply.findAll({
        where: { UserId: id },
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
          {
            model: Tweet,
            attributes: ['UserId'],
            include: { model: User, attributes: ['id', 'account'] }
          }
        ]
      }),
      User.findByPk(id)
    ])
      .then(([replies, user]) => {
        if (!replies) throw new Error('There is no any reply exists')
        if (!user) throw new Error("This User didn't exists!")

        const userReplies = replies.map(reply => {
          const data = {
            ...reply.toJSON()
          }

          return data
        })

        res.json(userReplies)
      })
      .catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {
    const { id } = req.params
    const user = helpers.getUser(req)
    const userId = Number(user.id)

    return Promise.all([
      Tweet.findAll({
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['UserId'] }
        ]
      }),
      Like.findAll({
        where: { UserId: id },
        attributes: ['TweetId']
      }),
      User.findByPk(id)
    ])
      .then(([tweets, likes, user]) => {
        if (!tweets) throw new Error('There is no any tweet exists')
        if (!likes) throw new Error('This user not yet like any tweet')
        if (!user) throw new Error("This User didn't exists!")

        const Tweets = tweets.map(tweet => tweet.toJSON())
        const Likes = likes.map(like => like.toJSON())

        const likeTweets = Tweets.filter(tweet => Likes.some(like => like.TweetId === tweet.id))
          .map(tweet => {
            const data = {
              ...tweet,
              replyCounts: tweet.Replies.length,
              likeCounts: tweet.Likes.length,
              isLiked: tweet.Likes.some(like => like.UserId === userId),
              TweetId: tweet.id
            }
            delete data.Replies
            delete data.Likes

            return data
          })

        res.json(likeTweets)
      })
      .catch(err => next(err))
  },
  putUserSetting: (req, res, next) => {
    const user = helpers.getUser(req)
    const userId = Number(user.id)
    const { account, name, email, password, checkPassword } = req.body

    if (!account || !name || !email || !password || !checkPassword) throw new Error('You should input all required parameters')
    if (name.length > 50) throw new Error("Name can't larger than 50 characters!")
    if (password !== checkPassword) throw new Error('Password do not match!')

    return Promise.all([
      User.findAll({
        attributes: ['id'],
        where: {
          id: { [Op.ne]: req.params.id },
          [Op.or]: [{ account }, { email }]
        }
      }),
      User.findByPk(req.params.id)
    ])
      .then(([users, user]) => {
        if (!user) throw new Error("User did't exist!")
        // 避免有人惡意修改其他人的設定
        if (user.id !== userId) throw new Error("You can't modify other user's setting!")
        // 反查不是該使用者，但是卻已經有相同的account或者email存在的情況 => 表示已經被其他人使用
        if (users.length !== 0) throw new Error('Account or email already exists!')

        return user.update({
          account,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
          name
        })
      })
      .then(user => {
        const userData = {
          ...user.toJSON()
        }
        delete userData.password
        res.json(userData)
      })
      .catch(err => next(err))
  },
  getUserFollowings: (req, res, next) => {
    const { id } = req.params
    const user = helpers.getUser(req)
    const userId = Number(user.id)

    return Promise.all([
      User.findAll({
        attributes: ['id', 'account', 'name', 'avatar', 'introduction'],
        // 為了確認是否isFollowed，故include [Followers]
        include: [
          { model: User, as: 'Followers', attributes: ['id'] }
        ]
      }),
      Followship.findAll({
        where: { followerId: id },
        attributes: ['followingId', 'createdAt']
      })
    ])
      .then(([users, followings]) => {
        if (!users) throw new Error('There is no user!')
        if (!followings) throw new Error('This user not yet follow other user!')

        const Users = users.map(user => user.toJSON())
        const Followings = followings.map(following => following.toJSON())

        const userFollowings = Users.filter(
          user => Followings.some(following => following.followingId === user.id)
        ).map(user => {
          const data = {
            ...user,
            followingId: user.id,
            // user/:id/followings，下方的Follower已指定為是此:id，故只會有一位，陣列選[0]即可。
            followingDate: user.Followers[0].Followship.createdAt,
            isFollowed: user.Followers.some(follower => follower.id === userId)
          }
          delete data.Followers

          return data
        })

        res.json(userFollowings)
      })
      .catch(err => next(err))
  },
  getUserFollowers: (req, res, next) => {
    const { id } = req.params
    const user = helpers.getUser(req)
    const userId = Number(user.id)

    return Promise.all([
      User.findAll({
        attributes: ['id', 'account', 'name', 'avatar', 'introduction'],
        // 為了確認是否isFollowed，故include [Followers]
        include: [
          { model: User, as: 'Followers', attributes: ['id'] }
        ]
      }),
      Followship.findAll({
        where: { followingId: id },
        attributes: ['followerId', 'createdAt']
      })
    ])
      .then(([users, followers]) => {
        if (!users) throw new Error('There is no user!')
        if (!followers) throw new Error('There are no user followed!')

        const Users = users.map(user => user.toJSON())
        const Followers = followers.map(follower => follower.toJSON())

        const userFollowers = Users.filter(
          user => Followers.some(follower => follower.followerId === user.id)
        ).map(user => {
          const data = {
            ...user,
            followerId: user.id,
            isFollowed: user.Followers.some(follower => follower.id === userId)
            // 這裡不顯示followingDate，因此用戶是被追蹤的，只要知道有誰追蹤他就好。
          }
          delete data.Followers

          return data
        })

        res.json(userFollowers)
      })
      .catch(err => next(err))
  },
  putUserProfile: (req, res, next) => {
    const user = helpers.getUser(req)
    const userId = Number(user.id)
    const { name, introduction } = req.body
    const { files } = req

    if (!name) throw new Error('Name is required!')
    if (name.length > 50) throw new Error("Name can't larger than 50 characters!")
    if (introduction.length > 160) throw new Error("Introduction can't larger than 160 characters!")

    if (!files) { // test沒有file
      return User.findByPk(req.params.id)
        .then(user => {
          if (!user) throw new Error("User did't exist!")
          // 避免有人惡意修改其他人的設定
          if (user.id !== userId) throw new Error("You can't modify other user's setting!")

          return user.update({
            name,
            introduction
          })
        })
        .then(user => {
          const userData = {
            ...user.toJSON()
          }
          delete userData.password
          delete userData.role
          res.json(userData)
        })
        .catch(err => next(err))
    } else {
      return Promise.all([
        User.findByPk(req.params.id),
        imgurFileHandler(files.avatar === undefined ? null : files.avatar[0]),
        imgurFileHandler(files.cover === undefined ? null : files.cover[0])
      ])
        .then(([user, avatar, cover]) => {
          if (!user) throw new Error("User did't exist!")
          // 避免有人惡意修改其他人的設定
          if (user.id !== userId) throw new Error("You can't modify other user's setting!")

          return user.update({
            name,
            introduction,
            avatar: avatar || user.avatar,
            cover: cover || user.cover
          })
        })
        .then(user => {
          const userData = {
            ...user.toJSON()
          }
          delete userData.password
          delete userData.role
          res.json(userData)
        })
        .catch(err => next(err))
    }
  }
}

module.exports = userController
