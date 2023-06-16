const bcrypt = require('bcryptjs')
const { User, Reply, Tweet, Followship, Like } = require('../../models')
const jwt = require('jsonwebtoken')
const { imgurFileHandler } = require('../../helpers/file-helpers')
const helpers = require('../../_helpers')


const userController = {
  signIn: async (req, res,) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.role === 'admin') throw new Error('Account does not exist!')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      const followingsCount = await Followship.count({ where: { followingId: helpers.getUser(req).id } })
      const followerCount = await Followship.count({ where: { followerId: helpers.getUser(req).id } })
      res.status(200).json({
        status: 'success',
        data: {
          token,
          user: userData,
          followingsCount: followingsCount,
          followerCount: followerCount
        }
      })
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message })
    }
  },
  signUp: (req, res) => {
    const { name, email, password, avatar, introduction, role, account, checkPassword } = req.body
    new Promise((resolve, reject) => {
      if (!account) {
        reject(new Error('Account is required'))
      } else if (account.length > 50) {
        reject(new Error(`Account too long`))
      }
      if (name && name.length > 50) { reject(new Error(`Name too long`)) }
      if (introduction && introduction.length > 160) reject(new Error('Introduction too long'))
      if (password !== checkPassword) reject(new Error('Password do not match'))
      resolve()
    })
      .then(() => {
        return Promise.all([
          User.findOne({ where: { email } }),
          User.findOne({ where: { account } })
        ])
      })
      .then(([user, account]) => {
        if (user) throw new Error('Email already exists!')
        if (account) throw new Error('Account already registered!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          name,
          email,
          avatar,
          introduction,
          role,
          account,
          banner: 'https://i.imgur.com/jsrSDDm.png',
          password: hash
        })
      })
      .then((user) => {
        user = user.toJSON()
        delete user.password
        return res.status(200).json(user)
      })
      .catch(err => {
        res.status(500).json({ status: 'error', error: err.message })
      })
  },
  getUser: (req, res) => {
    return Promise.all([
      User.findByPk(req.params.id, { attributes: { exclude: ['password'] } }),
      Followship.count({ where: { followerId: req.params.id } }),
      Followship.count({ where: { followingId: req.params.id } }),
      Tweet.findAll({ where: { UserId: req.params.id } })
    ])
      .then(([user, follower, following, Tweet]) => {
        if (!user) throw new Error(`User didn't exist`)
        user = user.toJSON()
        user.followerCount = follower
        user.followingCount = following
        user.TweetCount = Tweet.length
        return res.status(200).json(user)
      })
      .catch(err => res.status(500).json({ status: 'error', error: err.message }))
  },
  getUserTweets: (req, res) => {
    User.findByPk(req.params.id, {
      include: [{
        model: Tweet,
        include: [Reply, Like],
      }],
      order: [[Tweet, 'createdAt', 'DESC']],
    })
      .then(user => {
        if (!user) throw new Error(`User didn't exist`)
        const tweetsData = user.Tweets.map(tweet => ({
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          name: user.name,
          account: user.account,
          avatar: user.avatar,
          createdAt: tweet.createdAt,
          replyCount: tweet.Replies.length,
          likeCount: tweet.Likes.length
        }))
        return res.status(200).json(tweetsData)
      })
      .catch(err => res.status(500).json({ status: 'error', error: err }))
  },
  getUserReplies: (req, res) => {
    User.findByPk(req.params.id, {
      include: [{
        model: Reply, include: { model: Tweet, attributes: ['id'], include: { model: User, attributes: ['account'] } }
      }],
      order: [[Reply, 'createdAt', 'DESC']]
    })
      .then(user => {
        if (!user) throw new Error(`User didn't exist`)
        const repliesData = user.Replies.map(reply => {
          const replyJSON = reply.toJSON()
          return {
            ...replyJSON,
            name: user.name,
            account: user.account,
            avatar: user.avatar,
          }
        })
        return res.status(200).json(repliesData)
      })
      .catch(err => res.status(500).json({ status: 'error', error: err }))
  },
  getUserLikes: (req, res) => {
    User.findByPk(req.params.id, {
      include: [
        {
          model: Like,
          include: [{ model: Tweet, include: [User, Like, Reply] }]
        }],
      order: [[Like, 'createdAt', 'DESC']]
    })
      .then(user => {
        if (!user) throw new Error(`User didn't exist`)
        const likesData = user.Likes.map(like => {
          const likeJson = like.toJSON()
          return {
            UserId: likeJson.UserId,
            TweetId: likeJson.TweetId,
            createdAt: likeJson.createdAt,
            description: likeJson.Tweet.description,
            tweetOwnerName: likeJson.Tweet.User.name,
            tweetOwnerAccount: likeJson.Tweet.User.account,
            tweetOwnerAvatar: likeJson.Tweet.User.avatar,
            likeCount: likeJson.Tweet.Likes.length,
            replyCount: likeJson.Tweet.Replies.length,
            isLiked: likeJson.UserId === helpers.getUser(req).id
          }
        })
        return res.status(200).json(likesData)
      })
      .catch(err => res.status(500).json({ status: 'error', error: err }))
  },
  getUserFollowings: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: User, as: 'Followings',
          attributes: ['id', 'name', 'introduction', 'avatar'],
          through: { attributes: ['createdAt'] },
        }
      ],
    })
      .then((user) => {
        if (!user) throw new Error(`User didn't exist`)
        let followings = user.Followings.map(following => ({
          followingId: following.id,
          followingName: following.name,
          followingAvatar: following.avatar,
          followingIntroduction: following.introduction,
          followshipCreatedAt: following.Followship.createdAt,
          isFollowing: helpers.getUser(req).Followings.some(f => f.id === following.id)
        }))
        followings = followings.sort((a, b) =>
          new Date(b.followshipCreatedAt) - new Date(a.followshipCreatedAt))
        res.status(200).json(followings)
      })
      .catch(err => res.status(500).json({ status: 'error', error: err }))
  },
  getUserFollowers: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followers', }]
    })
      .then((user) => {
        if (!user) throw new Error(`User didn't exist`)
        const followers = user.Followers.map(follower => {
          return {
            followerName: follower.name,
            followerAvatar: follower.avatar,
            followerIntroduction: follower.introduction,
            followerId: follower.Followship.followerId,
            followingId: follower.Followship.followingId,
            createdAt: follower.Followship.createdAt,
            isFollowed: helpers.getUser(req).Followings.some(f => f.id === follower.id)
          }
        })
        followers.sort((a, b) => b.createdAt - a.createdAt)
        return res.status(200).json(followers)
      })
      .catch(err => res.status(500).json({ status: 'error', error: err }))
  },
  editUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error(`User didn't exist`)
        user = user.toJSON()
        delete user.password
        return res.status(200).json({ status: 'success', user })
      })
      .catch(err => res.status(500).json({ status: 'error', error: err }))
  },
  putUser: (req, res) => {
    const { name, introduction } = req.body
    const files = req.files || {}
    if (!name) throw new Error('User name is required')
    return Promise.all([
      User.findByPk(helpers.getUser(req).id),
      files.avatar ? imgurFileHandler(files.avatar[0]) : null,
      files.banner ? imgurFileHandler(files.banner[0]) : null
    ])
      .then(([user, avatarPath, bannerPath]) => {
        if (!user) throw new Error("User didn't exist!")
        if (user.id !== Number(req.params.id)) throw new Error('Edit self profile only!')
        return user.update({
          name,
          introduction,
          avatar: avatarPath || user.avatar,
          banner: bannerPath || user.banner
        })
      })
      .then((updatedUser) => {
        updatedUser = updatedUser.toJSON()
        delete updatedUser.password
        return res.status(200).json(updatedUser)
      })
      .catch(err => res.status(500).json({ status: 'error', error: err.message }))
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
        return Followship.create({
          followerId: helpers.getUser(req).id,
          followingId: userId
        })
      })
      .then(updateFollowship => res.status(200).json(updateFollowship))
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
      .then(removedFollowship => res.status(200).json(removedFollowship))
      .catch(err => res.status(500).json({ status: 'error', error: err.message }))
  },
  getTopUsers: (req, res) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        users = users.map(user => {
          let userData = user.toJSON()
          delete userData.password
          userData.Followers = userData.Followers.map(follower => {
            delete follower.password
            return follower
          })
          return {
            ...userData,
            followersCount: user.Followers.length,
            isFollowed: helpers.getUser(req).Followings.some(f => f.id === user.id)
          }
        })
        users = users.sort((a, b) => b.followersCount - a.followersCount)
        users = users.slice(0, 10)
        return res.status(200).json({ status: 'success', users })
      })
      .catch(err => res.status(500).json({ status: 'error', error: err.message }))
  }
}

module.exports = userController
