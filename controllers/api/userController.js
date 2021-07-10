const db = require('../../models')
const User = db.User
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const defaultLimit = 10

let userController = {
  postUser: (req, res) => {
    const { name, account, email, password, checkPassword } = req.body
    if (!name || !account || !email || !password || !checkPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing data.'
      })
    }
    if (password !== checkPassword) {
      return res.status(400).json({
        status: 'error',
        message: "Password and confirm password doesn't match."
      })
    }
    User.findOne({
      where: {
        account,
        role: 'user'
      }
    })
      .then((user) => {
        if (user) {
          return res.status(400).json({
            status: 'error',
            message: 'Account was already used.'
          })
        } else {
          User.findOne({
            where: {
              email,
              role: 'user'
            }
          })
            .then((user) => {
              if (user) {
                return res.status(400).json({
                  status: 'error',
                  message: 'Email was already used.'
                })
              } else {
                User.create({
                  name,
                  account,
                  email,
                  password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                })
                  .then((user) => {
                    return res.status(200).json({
                      status: 'success',
                      message: 'Account successfully created.'
                    })
                  })
              }
            })
        }
      })
      .catch((error) => {
        return res.status(500).json({
          status: 'error',
          message: error
        })
      })
  },
  getUser: (req, res) => {
    const id = +req.params.id
    const userId = +req.user.id
    const options = {
      attributes: ['id', 'account', 'name', 'email', 'introduction', 'avatar', 'cover', 'tweetNum', 'likeNum', 'followingNum', 'followerNum', 'lastLoginAt'],
      include: [
        {
          model: User,
          as: 'Followers',
          attributes: ['id']
        }
      ],
      where: { role: 'user' }
    }
    User.findByPk(id, options)
      .then((user) => {
        if (user) {
          user.dataValues.isFollowing = user.dataValues.Followers.some(
            (follower) => follower.id === userId
          )
          delete user.dataValues.Followers
          return res.json(user)
        }
        return res
          .status(404)
          .json({
            status: 'error',
            message: 'User not found.'
          })
      })
      .catch((error) => {
        return res.status(500).json({
          status: 'error',
          message: error
        })
      })
  },
  putUser: (req, res) => {
    const id = +req.params.id
    const userId = +req.user.id
    const { name, account, password, email, passwordNew, passwordNewCheck, introduction } = req.body
    const { files } = req
    async function saveAndRes(user) {
      await user.update(user.dataValues)
      delete user.dataValues.role
      delete user.dataValues.password
      delete user.dataValues.createdAt
      delete user.dataValues.updatedAt
      return res.status(200).json(user)
    }
    // check user permission
    if (id !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'You have no permission to edit this account.'
      })
    }
    // if there's a password update
    if (passwordNew) {
      if (!passwordNewCheck) {
        return res.status(400).json({
          status: 'error',
          message: 'New password confirmation missing.'
        })
      }
      if (!password) {
        return res.status(400).json({
          status: 'error',
          message: 'Current password missing.'
        })
      }
      if (passwordNew != passwordNewCheck) {
        return res.status(400).json({
          status: 'error',
          message: "Password and confirm password doesn't match."
        })
      }
    }
    // if there's a introduction update
    if (introduction && introduction.length > 140) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot post over 140 characters'
      })
    }

    User.findByPk(id)
      .then(async (user) => {
        if (account && user.account !== account) {
          await User.findOne({ where: { account, role: 'user' } }).then((otherUser) => {
            //check if account was already used
            if (otherUser && otherUser.id !== id) {
              return res.status(400).json({
                status: 'error',
                message: 'Account was already used.'
              })
            }
            user.account = account
            return user
          })
        }
        if (email && user.email !== email) {
          await User.findOne({ where: { email, role: 'user' } }).then(
            (otherUser) => {
              //check if email was already used
              if (otherUser && otherUser.id !== id) {
                return res.status(400).json({
                  status: 'error',
                  message: 'Email was already used.'
                })
              }
              user.email = email
              return user
            }
          )
        }
        return user
      })
      .then(async (user) => {
        //check current password before adding new password
        if (passwordNew && !bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({
            status: 'error',
            message: 'Current password incorrect.'
          })
        }
        user.name = name || user.name
        user.password = passwordNew
          ? bcrypt.hashSync(passwordNew, bcrypt.genSaltSync(10))
          : user.password
        user.introduction = introduction || user.introduction
        // two image files
        if (files && files.avatar && files.cover) {
          imgur.setClientID(IMGUR_CLIENT_ID)
          return new Promise((resolve, reject) => {
            imgur.upload(files.avatar[0].path, (err, avatar) => {
              resolve(avatar.data.link)
            })
          }).then(async (avatar) => {
            return new Promise((resolve, reject) => {
              imgur.upload(files.cover[0].path, (err, cover) => {
                resolve({ avatar, cover: cover.data.link })
              })
            })
              .then(async (links) => {
                user.avatar = links.avatar
                user.cover = links.cover
                await saveAndRes(user)
              })
              .catch((err) => {
                return res.status(500).json({ status: 'error', message: err })
              })
          })
        }
        // one image file
        else if (files && (files.avatar || files.cover)) {
          imgur.setClientID(IMGUR_CLIENT_ID)
          image = files.avatar || files.cover
          imageName = files.avatar ? 'avatar' : 'cover'
          return imgur.upload(image[0].path, (err, image) => {
            user[imageName] = image.data.link
            saveAndRes(user).catch(err => console.log(err))
          })
        }
        // no image file
        else {
          await saveAndRes(user)
        }
      })
  },
  login: (req, res) => {
    const { password, email } = req.body
    if (!password || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Password or email can not be empty.'
      })
    }

    User.findOne({ where: { email, role: 'user' } })
      .then((user) => {
        if (!user) {
          return res
            .status(401)
            .json({
              status: 'error',
              message: "This user doesn't exist."
            })
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return res
            .status(401)
            .json({
              status: 'error',
              message: 'Password incorrect.'
            })
        }
        let payload = {
          id: user.id
        }
        let token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.status(200).json({
          status: 'success',
          message: 'User successfully login.',
          token,
          User: {
            id: user.id,
            name: user.name,
            account: user.account,
            email: user.email
          }
        })
      })
      .catch((error) =>
        res.status(500).json({
          status: 'error',
          message: error
        })
      )
  }
}
module.exports = userController
