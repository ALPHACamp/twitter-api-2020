const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const helper = require('../../_helpers')
const imgur = require('imgur-node-api')
const { Op } = require('sequelize')
const { User, Tweet, Reply, Like, Followship } = require('../../models')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUp: async (req, res) => {
    try {
      const { account, name, email, password, passwordCheck } = req.body
      if (!account || !name || !email || !password) {
        return res.json({ status: 'error', message: "Required fields didn't exist." })
      }
      if (password !== passwordCheck) {
        return res.json({ status: 'error', message: "Passwords didn't match." })
      }
      const users = await User.findAll({ raw: true, where: { [Op.or]: [{ email }, { account }] } })
      if (users.length) {
        return users.forEach((user) => {
          if (user.account === account && user.email === email) {
            return res.json({ status: 'error', message: 'This email and account are already in use.' })
          } else if (user.account === account) {
            return res.json({ status: 'error', message: 'This account is already in use.' })
          } else if (user.email === email) {
            return res.json({ status: 'error', message: 'This email is already in use.' })
          }
        })
      }

      const [user, created] = await User.findOrCreate({
        where: {
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        }
      })
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      res.json({
        status: 'success',
        message: 'ok',
        token,
        user
      })
    } catch (error) {
      console.log(error)
    }
  },
  signIn: async (req, res) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return res.json({ status: 'error', message: "Required fields didn't exist." })
      }
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'No such user found.' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: "Password didn't match." })
      }

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      res.json({
        status: 'success',
        message: 'ok',
        token,
        user
      })
    } catch (error) {
      console.log(error)
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id)
      return res.json(user)
    } catch (error) {
      console.log(error)
    }
  },
  getCurrentUser: (req, res) => {
    const user = helper.getUser(req)
    return res.json(user)
  },
  updateUser: async (req, res) => {
    try {
      const id = Number(req.params.id)
      if (id !== helper.getUser(req).id) {
        return res.json({ status: 'error', message: 'Permission denied.' })
      }
      const user = await User.findByPk(id)
      if (!user) {
        return res.json({ status: 'error', message: "This user doesn't exist." })
      }
      const { email, name, password, account, introduction } = req.body
      if (!account || !name || !email || !password) {
        return res.json({ status: 'error', message: "Required fields didn't exist." })
      }

      let avatar = user.avatar
      let cover = user.cover
      if (req.files) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        if (req.files.avatar) {
          [avatar] = [...req.files.avatar]
          const avatarUpload = new Promise((resolve, reject) => {
            imgur.upload(avatar.path, (err, res) => {
              if (err) return reject(err)
              return resolve(res)
            })
          })
          const avatarImg = await avatarUpload
          avatar = avatarImg.data.link
        }
        if (req.files.cover) {
          [cover] = [...req.files.cover]
          const coverUpload = new Promise((resolve, reject) => {
            imgur.upload(cover.path, (err, res) => {
              if (err) return reject(err)
              return resolve(res)
            })
          })
          const coverImg = await coverUpload
          cover = coverImg.data.link
        }
      }

      await User.update({
        name, email, password, account, introduction, avatar, cover
      }, { where: { id } })
      res.json({ status: 'success', message: 'ok' })
    } catch (error) {
      console.log(error)
    }
  },
  getTopUsers: async (req, res) => {
    try {
      let users = await User.findAll({ include: [{ model: User, as: 'Followers' }] })
      users = users.map((user) => ({
        ...user.dataValues,
        followerCount: user.getFollowers.length,
        isFollowed: helper.getUser(req).Followings.map((follower) => follower.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.followerCount - a.followerCount)
      res.json(users)
    } catch (error) {
      console.log(error)
    }
  },
  getTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        include: [Reply, Like],
        order: [['createdAt', 'DESC']]
      })
      res.json(tweets)
    } catch (error) {
      console.log(error)
    }
  },
  getRepliedTweets: async (req, res) => {
    try {
      const replies = await Reply.findAll({
        where: { UserId: req.params.id },
        include: Tweet,
        order: [['createdAt', 'DESC']]
      })
      res.json(replies)
    } catch (error) {
      console.log(error)
    }
  },
  getLikedTweets: async (req, res) => {
    try {
      const likedTweets = await Tweet.findAll({
        include: { model: Like, where: { UserId: req.params.id } },
        order: [[{ model: Like }, 'createdAt', 'DESC']]
      })
      res.json(likedTweets)
    } catch (error) {
      console.log(error)
    }
  },
  getFollowings: async (req, res) => {
    try {
      const followings = await User.findByPk(req.params.id, {
        include: [{ model: User, as: 'Followings' }],
        order: [[{ model: User, as: 'Followings' }, { model: Followship }, 'createdAt', 'DESC']]
      })
      res.json(followings)
    } catch (error) {
      console.log(error)
    }
  },
  getFollowers: async (req, res) => {
    try {
      const followers = await User.findByPk(req.params.id, {
        include: [{ model: User, as: 'Followers' }],
        order: [[{ model: User, as: 'Followers' }, { model: Followship }, 'createdAt', 'DESC']]
      })
      res.json(followers)
    } catch (error) {
      console.log(error)
    }
  },
  addFollowing: async (req, res) => {
    try {
      const followingId = Number(req.params.followingId)
      if (followingId === helper.getUser(req).id) {
        return res.json({ status: 'error', message: 'Cannot follow yourself.' })
      }
      const user = await User.findByPk(followingId)
      if (!user) {
        return res.json({ status: 'error', message: "This user doesn't exist." })
      }
      const followings = await Followship.findAll({ raw: true, where: { followerId: helper.getUser(req).id } })
      if (followings.map((user) => user.followingId).includes(followingId)) {
        return res.json({ message: 'This user was already in follow.' })
      }
      await Followship.create({
        followerId: helper.getUser(req).id,
        followingId: followingId
      })
      res.json({ status: 'success', message: 'ok' })
    } catch (error) {
      console.log(error)
    }
  },
  removeFollowing: async (req, res) => {
    try {
      const followingId = Number(req.params.followingId)
      const user = await User.findByPk(followingId)
      if (!user) {
        return res.json({ status: 'error', message: "This user doesn't exist." })
      }
      const followings = await Followship.findAll({ raw: true, where: { followerId: helper.getUser(req).id } })
      if (!followings.map((user) => user.followingId).includes(followingId)) {
        return res.json({ status: 'error', message: "This user didn't exist in your following list." })
      }
      await Followship.destroy({ where: { followingId, followerId: helper.getUser(req).id } })
      res.json({ status: 'success', message: 'ok' })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = userController
