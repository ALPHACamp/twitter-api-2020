const bcrypt = require('bcryptjs')
const { User, Reply, Tweet, Followship, Like } = require('../../models')
const jwt = require('jsonwebtoken')
const { imgurFileHandler } = require('../../helpers/file-helpers')
const helpers = require('../../_helpers')
// sequelize Op 比較功能
const { Op } = require('sequelize')
const userServices = require('../../services/user-services')

const userController = {
  signIn: (req, res, next) => {
    if (helpers.getUser(req).role === 'admin') return res.status(400).json({ status: 'error', message: 'Account does not exist!' })
    userServices.signIn(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  signUp: (req, res, next) => {
    const { name, email, password, account, checkPassword } = req.body
    if (!account) {
      return res.status(400).json({ status: 'error', message: 'Account is required' })
    } else if (account.length > 50) {
      return res.status(400).json({ status: 'error', message: 'Account too long' })
    }
    if (name && name.length > 50) return res.status(400).json({ status: 'error', message: 'Name too long' })
    if (password !== checkPassword) return res.status(400).json({ status: 'error', message: 'Password do not match' })

    userServices.signUp({ name, email, password, account }, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getUserTweets: (req, res, next) => {
    userServices.getUserTweets(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getUserReplies: (req, res, next) => {
    userServices.getUserReplies(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getUserLikes: (req, res, next) => {
    userServices.getUserLikes(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getUserFollowings: (req, res, next) => {
    userServices.getUserFollowings(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getUserFollowers: (req, res, next) => {
    userServices.getUserFollowers(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  editUser: (req, res, next) => {
    userServices.editUser(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  putUser: (req, res, next) => {
    const { name, introduction } = req.body
    if (!name) return res.status(400).json({ status: 'error', message: 'User name is required' })

    userServices.putUser(req, { name, introduction }, (err, data) => err ? next(err) : res.status(200).json(data))

  },
  getSetUser: (req, res, next) => {
    userServices.getSetUser(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  putSetUser: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'The fields for account, name, password and email are required!' })
    }
    if (account.length > 50) return res.status(400).json({ status: 'error', message: 'Account too long' })
    if (name && name.length > 50) return res.status(400).json({ status: 'error', message: 'Name too long' })
    if (password !== checkPassword) return res.status(400).json({ status: 'error', message: 'Password do not match' })

    userServices.putSetUser(req, { account, name, email, password }, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  addLike: (req, res) => {
    return Promise.all([
      Tweet.findByPk(req.params.id),
      Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: req.params.id
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error(`tweet didn't exist!`)
        if (like) throw new Error(`You have liked this tweet!`)
        return Like.create({
          UserId: helpers.getUser(req).id,
          TweetId: req.params.id
        })
      })
      .then((likedTweet) => res.status(200).json(likedTweet))
      .catch(err => res.status(500).json({ status: 'error', error: err.message }))
  },
  removeLike: (req, res) => {
    Like.findOne({
      where: {
        userId: helpers.getUser(req).id,
        tweetId: req.params.id
      }
    })
      .then(like => {
        if (!like) throw new Error(`You haven't liked this tweet`)
        return like.destroy()
      })
      .then(removedLike => res.status(200).json(removedLike))
      .catch(err => res.status(500).json({ status: 'error', error: err.message }))
  },
  addFollowing: (req, res) => {
    const userId = req.body.id
    Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        if (helpers.getUser(req).id === Number(req.body.id)) throw new Error('Cannot follow oneself!')
        return Followship.create({
          followerId: helpers.getUser(req).id,
          followingId: userId
        })
      })
      .then(updateFollowship => {
        updateFollowship = updateFollowship.toJSON()
        updateFollowship.isFollowed = true
        res.status(200).json(updateFollowship)
      })
      .catch(err => res.status(500).json({ status: 'error', error: err.message }))
  },
  removeFollowing: (req, res) => {
    const { followingId } = req.params
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: followingId
      }
    })
      .then(followship => {
        if (!followship) throw new Error(`You haven't followed this user!`)
        return followship.destroy()
      })
      .then(removedFollowship => {
        removedFollowship = removedFollowship.toJSON()
        removedFollowship.isFollowed = false
        res.status(200).json(removedFollowship)
      })
      .catch(err => res.status(500).json({ status: 'error', error: err.message }))
  },
  getTopUsers: (req, res) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        if (!users || users.length === 0) throw new Error(`User is not exist!`)
        const currentUserId = helpers.getUser(req).id
        users = users.sort((a, b) => b.Followers.length - a.Followers.length)
        users = users.some(u => u.id === currentUserId)
          ? users.slice(0, 11)
          : users.slice(0, 10)
        users = users.filter(user => user.id !== currentUserId)
        const topUsers = users.map(user => {
          return {
            id: user.id,
            name: user.name,
            account: user.account,
            avatar: user.avatar,
            followersCount: user.Followers.length,
            isFollowed: helpers.getUser(req).Followings.some(f => f.id === user.id)
          }
        })
        return res.status(200).json({ topUsers })
      })
      .catch(err => res.status(500).json({ status: 'error', error: err.message }))
  }
}

module.exports = userController
