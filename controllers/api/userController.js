const db = require('../../models')
const User = db.User
const bcrypt = require('bcrypt-nodejs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const defaultLimit = 10

let userController = {
  getUsers: (req, res) => {
    const offset = +req.query.offset || 0
    const limit = +req.query.limit || defaultLimit
    const userId = 1 //before building JWT
    const order = [['followerNum', 'DESC']]
    const attributes = ['id', 'account', 'name', 'avatar', 'cover', 'tweetNum', 'likeNum', 'followingNum', 'followerNum', 'lastLoginAt']
    User.findAll({
      offset, limit, order, attributes,
      include: [{
        model: User,
        as: "Followers",
        attributes: ['id']
      }]
    }).then(users => {
      users = users.map(user => {
        user.dataValues.isFollowing = user.dataValues.Followers.some(follower => follower.id === userId)
        delete user.dataValues.Followers
        return user
      })
      return res.status(200).json({ Users: users })
    }).catch(err => {
      return res.status(500).json({ status: 'error', message: err })
    })
  },
  postUser: (req, res) => {
    const { name, account, email, password, checkPassword } = req.body
    if (!name || !account || !email || !password || !checkPassword) {
      return res.status(401).json({
        status: 'error', message: "Missing data."
      })
    }
    if (password !== checkPassword) {
      return res.status(401).json({
        status: 'error', message: "Password and confirm password doesn't match."
      })
    }
    User.findOne({ where: { account } }).then(user => {
      if (user) {
        return res.status(401).json({
          status: 'error', message: "Account was already used."
        })
      } else {
        User.findOne({ where: { email } }).then(user => {
          if (user) {
            return res.status(401).json({
              status: 'error', message: "Email was already used."
            })
          } else {
            User.create({
              name,
              account,
              email,
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
            })
              .then(user => {
                return res.status(200).json({
                  status: 'success', message: "Account successfully created."
                })
              })
          }
        })
      }
    }).catch(err => {
      return res.status(500).json({ status: 'error', message: err })
    })
  },
  getUser: (req, res) => {
    const id = req.params.id
    const userId = +req.user.id 
    const attributes = ['id', 'account', 'name', 'email', 'introduction', 'avatar', 'cover', 'tweetNum', 'likeNum', 'followingNum', 'followerNum', 'lastLoginAt']
    User.findByPk(id, {
      attributes,
      include: [{
        model: User,
        as: "Followers",
        attributes: ['id']
      }]
    }).then(user => {
      if (user) {
        user.dataValues.isFollowing = user.dataValues.Followers.some(follower => follower.id === userId)
        delete user.dataValues.Followers
        return res.json(user)
      }
      return res.status(404).json({ status: 'error', message: 'User not found.' })
    }).catch(err => {
      return res.status(500).json({ status: 'error', message: err })
    })
  },
  putUser: (req, res) => {
    const id = Number(req.params.id)
     const userId = +req.user.id  
    const { name, account, password, email, passwordNew, passwordNewCheck, introduction, avatar, cover } = req.body
    const { files } = req
    async function saveAndRes(user) {
      await user.save()
      delete user.dataValues.password
      delete user.dataValues.createdAt
      delete user.dataValues.updatedAt
      return res.status(200).json(user)
    }
    // check user permission
    if (id !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'You have no access to this account.'
      })
    }
    // if there's a password update
    if (passwordNew) {
      if (!passwordNewCheck) {
        return res.status(401).json({
          status: 'error',
          message: 'New password confirmation missing.'
        })
      }
      if (!password) {
        return res.status(401).json({
          status: 'error',
          message: 'Current password missing.'
        })
      }
      if (passwordNew != passwordNewCheck) {
        return res.status(401).json({
          status: 'error',
          message: "Password and confirm password doesn't match."
        })
      }
    }
    // if there's a introduction update
    if (introduction && (introduction.length > 140)) {
      return res.status(401).json({
        status: 'error',
        message: "Can not post over 140 characters"
      })
    }

    User.findByPk(id)
      .then(user => {
        if (!account || user.account === account) {
          return user
        }
        else {
          return User.findOne({ where: { account } }).then(otherUser => {
            //check if account was already used
            if (otherUser && otherUser.id !== id) {
              return res.status(401).json({
                status: 'error',
                message: 'Account was already used.'
              })
            }
            user.account = account
            return user
          })
        }
      })
      .then(user => {
        if (!email || user.email === email) {
          return user
        } else {
          return User.findOne({ where: { email } }).then(otherUser => {
            //check if email was already used
            if (otherUser && otherUser.id !== id) {
              return res.status(401).json({
                status: 'error',
                message: 'Email was already used.'
              })
            }
            user.email = email
            return user
          })
        }
      })
      .then(user => {
        //check current password before add new password
        if (passwordNew && !bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({
            status: 'error',
            message: "Current password incorrect."
          })
        }
        user.name = name || user.name
        user.password = passwordNew ? bcrypt.hashSync(passwordNew, bcrypt.genSaltSync(10)) : user.password
        user.introduction = introduction || user.introduction
        return user
      })
      .then(async (user) => {
        // two image files
        if (files && files.avatar && files.cover) {
          imgur.setClientID(IMGUR_CLIENT_ID)
          return new Promise((resolve, reject) => {
            imgur.upload(files.avatar[0].path, (err, avatar) => { resolve(avatar.data.link) })
          })
            .then(async (avatar) => {
              return new Promise((resolve, reject) => {
                imgur.upload(files.cover[0].path, (err, cover) => { resolve({ avatar, cover: cover.data.link }) })
              })
                .then(async (links) => {
                  user.avatar = links.avatar
                  user.cover = links.cover
                  return await saveAndRes(user)
                })
                .catch(err => { return res.status(500).json({ status: 'error', message: err }) })
            })
        }
        // one image file
        else if (files && (files.avatar || files.cover)) {
          imgur.setClientID(IMGUR_CLIENT_ID)
          image = files.avatar || files.cover
          imageName = files.avatar ? 'avatar' : 'cover'
          return imgur.upload(image[0].path, async (err, image) => {
            user.dataValues[imageName] = image.data.link
            return await saveAndRes(user)
          })
        }
        // no image file
        else {
          return await saveAndRes(user)
        }
      })
  }
}
module.exports = userController