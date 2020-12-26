const helpers = require('../_helpers')

const bcrypt = require('bcryptjs')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const userController = {
  readUser: (req, res, next) => {
    const id = Number(req.params.id)
    User.findOne({
      where: { id: id, role: 'user' },
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ]
    }).then(user => {
      if (!user) {
        return res.status(400).json({ message: `this user(id: ${id}) do not exist!` })
      }

      const UserId = helpers.getUser(req).id
      const userObj = {
        ...Object.fromEntries(Object.entries(user.toJSON()).slice(0, 11)),
        isSelf: (user.id === UserId),
        isFollowed: user.Followers.map(follower => follower.id).includes(UserId),
        tweetsCount: user.Tweets.length,
        followingsCount: user.Followings.length,
        followersCount: user.Followers.length
      }
      return res.json(userObj)
    }).catch(next)
  },

  readTweets: (req, res, next) => {
    const UserId = Number(req.params.id)
    User.findByPk(UserId).then(user => {
      if (!user) {
        return res.status(400).json({ message: `this user(id: ${UserId}) do not exist!` })
      }

      return Tweet.findAll({
        where: { UserId },
        order: [['createdAt', 'DESC']],
        include: [Reply, Like]
      }).then(tweets => {
        tweets = tweets.map(tweet => ({
          ...(Object.fromEntries(Object.entries(tweet.dataValues).slice(0, 5))),
          repliesCount: tweet.Replies.length,
          likesCount: tweet.Likes.length,
          isLike: tweet.Likes.map(like => like.UserId).includes(helpers.getUser(req).id)
        }))
        return res.json(tweets)
      })
    }).catch(next)
  },

  readRepliedTweets: (req, res, next) => {
    const UserId = Number(req.params.id)
    User.findByPk(UserId).then(user => {
      if (!user) {
        return res.status(400).json({ message: `this user(id: ${UserId}) do not exist!` })
      }

      return Reply.findAll({
        where: { UserId },
        order: [['createdAt', 'DESC']],
        include: [{
          model: Tweet,
          required: true, // INNER JOIN to select not null record
          include: [
            { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
            { model: Reply, attributes: ['id'] },
            { model: Like, attributes: ['id', 'UserId'] }
          ]
        }]
      }).then(replies => {
        replies = replies.map(reply => ({
          ...(Object.fromEntries(Object.entries(reply.dataValues).slice(0, 7))),
          Tweet: {
            ...(Object.fromEntries(Object.entries(reply.dataValues.Tweet.dataValues).slice(0, 6))),
            repliesCount: reply.Tweet.Replies.length,
            likesCount: reply.Tweet.Likes.length,
            isLike: reply.Tweet.Likes.map(like => like.UserId).includes(helpers.getUser(req).id)
          },
        }))
        return res.json(replies)
      })
    }).catch(next)
  },

  readLikes: (req, res, next) => {
    const UserId = Number(req.params.id)
    User.findByPk(UserId).then(user => {
      if (!user) {
        return res.status(400).json({ message: `this user(id: ${UserId}) do not exist!` })
      }

      return Like.findAll({
        where: { UserId },
        order: [['createdAt', 'DESC']],
        include: [{
          model: Tweet, include: [
            { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
            { model: Reply, attributes: ['id'] },
            { model: Like, attributes: ['id', 'UserId'] }
          ]
        }]
      }).then(likes => {
        likes = likes.map(like => ({
          ...(Object.fromEntries(Object.entries(like.dataValues).slice(0, 5))),
          Tweet: {
            ...(Object.fromEntries(Object.entries(like.dataValues.Tweet.dataValues).slice(0, 6))),
            repliesCount: like.Tweet.Replies.length,
            likesCount: like.Tweet.Likes.length,
            isLike: like.Tweet.Likes.map(like => like.UserId).includes(helpers.getUser(req).id)
          },
        }))
        return res.json(likes)
      })
    }).catch(next)
  },

  readFollowings: (req, res, next) => {
    const id = Number(req.params.id)
    User.findByPk(id, {
      include: [{
        model: User,
        as: 'Followings',
        attributes: ['id', 'account', 'name', 'avatar', 'introduction']
      }],
    }).then(user => {
      if (!user) {
        return res.status(400).json({ message: `this user(id: ${UserId}) do not exist!` })
      }

      let followings = user.Followings
      followings = followings.map(following => ({
        followingId: following.id,
        ...Object.fromEntries(Object.entries(following.dataValues).slice(1, 5)),
        followshipCreatedAt: following.Followship.createdAt,
        isFollowed: helpers.getUser(req).Followings.map(following => following.id).includes(following.id)
      }))
      followings = followings.sort((a, b) => b.followshipCreatedAt - a.followshipCreatedAt)
      return res.json(followings)
    }).catch(next)
  },

  readFollowers: (req, res, next) => {
    const id = Number(req.params.id)
    User.findByPk(id, {
      include: [{
        model: User,
        as: 'Followers',
        attributes: ['id', 'account', 'name', 'avatar', 'introduction']
      }],
    }).then(user => {
      if (!user) {
        return res.status(400).json({ message: `this user(id: ${UserId}) do not exist!` })
      }

      let followers = user.Followers
      followers = followers.map(follower => ({
        followerId: follower.id,
        ...Object.fromEntries(Object.entries(follower.dataValues).slice(1, 5)),
        followshipCreatedAt: follower.Followship.createdAt,
        isFollowed: helpers.getUser(req).Followings.map(following => following.id).includes(follower.id)
      }))
      followers = followers.sort((a, b) => b.followshipCreatedAt - a.followshipCreatedAt)
      return res.json(followers)
    }).catch(next)
  },

  readTopUsers: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    User.findAll({
      where: {
        id: { ne: currentUser.id },
        role: 'user'
      },
      attributes: ['id', 'account', 'name', 'avatar'],
      include: [{
        model: User,
        as: 'Followers',
        attributes: ['id']
      }],
    }).then(users => {
      users = users.map(user => ({
        ...Object.fromEntries(Object.entries(user.dataValues).slice(0, 4)),
        followersCount: user.Followers.length,
        isFollowed: currentUser.Followings.map(following => following.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.followersCount - a.followersCount)
      users = users.slice(0, 10)
      return res.json(users)
    }).catch(next)
  },

  updateUser: (req, res, next) => {
    const id = Number(req.params.id)
    const update = req.body
    const files = req.files || {}

    // if update account
    if (Object.keys(update).includes('account')) {
      if (!update.account || !update.name || !update.email) {
        return res.status(400).json({ message: 'account, name, email are required' })
      }
      return User.findAll({
        where: {
          id: { $ne: id },
          $or: [
            { account: { $eq: update.account } },
            { email: { $eq: update.email } }
          ]
        }
      }).then(users => {
        // check account and email to be unique
        if (users.length) {
          if (users.map(user => user.account).includes(update.account)) {
            return res.status(400).json({ message: `account: '${update.account}' has already existed!` })
          }
          if (users.map(user => user.email).includes(update.email)) {
            return res.status(400).json({ message: `email: '${update.email}' has already existed!` })
          }
        }

        // if update password
        if (Object.keys(update).includes('oldPassword')) {
          if (!update.newPassword || !update.checkPassword) {
            return res.status(400).json({ message: 'if wanna change password, newPassword & checkPassword are required!' })
          }
          return User.findByPk(id).then(user => {
            if (!bcrypt.compareSync(update.oldPassword, user.password)) {
              return res.status(403).json({ message: 'oldPassword is wrong' })
            }
            if (update.newPassword !== update.checkPassword) {
              return res.status(400).json({ message: 'newPassword & checkPassword are different!' })
            }
            return findAndUpdate(res, next, id, update)
          })
        }
        return findAndUpdate(res, next, id, update)
      }).catch(next)
    }

    // if update profile
    if (files.avatar && files.cover) {
      const imageFiles = [files.avatar[0].path, files.cover[0].path]
      imgur.setClientId(IMGUR_CLIENT_ID)
      return imgur.uploadImages(imageFiles, 'File')
        .then(imgs => findAndUpdate(res, next, id, update, imgs[0].link, imgs[1].link))
        .catch(next)
    }
    if (files.avatar && !files.cover) {
      const avatarFile = files.avatar[0].path
      imgur.setClientId(IMGUR_CLIENT_ID)
      return imgur.uploadFile(avatarFile)
        .then(img => findAndUpdate(res, next, id, update, img.data.link, null))
        .catch(next)
    }
    if (!files.avatar && files.cover) {
      const coverFile = files.cover[0].path
      imgur.setClientId(IMGUR_CLIENT_ID)
      return imgur.uploadFile(coverFile)
        .then(img => findAndUpdate(res, next, id, update, null, img.data.link))
        .catch(next)
    }
    return findAndUpdate(res, next, id, update)
  }
}

function findAndUpdate(res, next, UserId, updateObj, newAvatar, newCover) {
  User.findByPk(UserId, {
    attributes: { exclude: ['createdAt', 'updatedAt', 'role'] }
  }).then(user =>
    user.update({
      ...updateObj,
      password: updateObj.newPassword ? bcrypt.hashSync(updateObj.newPassword, bcrypt.genSaltSync(10)) : user.password,
      avatar: newAvatar ? newAvatar : user.avatar,
      cover: newCover ? newCover : user.cover
    }).then(user => res.json({
      status: 'success',
      message: `user: ${user.name} is updated successfully!`,
      user
    }))
  ).catch(next)
}

module.exports = userController
