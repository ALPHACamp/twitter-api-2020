const db = require('../../models')
const User = db.User
const sequelize = require('sequelize')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const imgurUpload = require('../../_helpers').imgurUpload


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
    if (name.length > 50) {
      return res.status(400)
        .json({
          status: 'error',
          message: 'Cannot post over 50 characters.'
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
  getCurrentUser: (req, res) => {
    const options = {
      attributes: [
        'id',
        'account',
        'name',
        'email',
        'avatar',
        'role',
      ],
    }
    User.findByPk(req.user.id, options)
      .then((user) => {
        return res.status(200).json(user)
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
    if (introduction && introduction.length > 160) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot post over 160 characters'
      })
    }
    // if there's a name update
    if (name && name.length > 50) {
      return res.status(400)
        .json({
          status: 'error',
          message: 'Cannot post over 50 characters.'
        })
    }

    User.findByPk(id)
      .then(async (user) => {
        const modifiedData = {}
        if (account && user.account !== account) {
          await User.findOne({ where: { account, role: 'user' } }).then((otherUser) => {
            //check if account was already used
            if (otherUser && otherUser.id !== id) {
              return res.status(400).json({
                status: 'error',
                message: 'Account was already used.'
              })
            }
            modifiedData.account = account
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
              modifiedData.email = email
            }
          )
        }
        //check current password before adding new password
        if (passwordNew && !bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({
            status: 'error',
            message: 'Current password incorrect.'
          })
        }
        modifiedData.name = name || user.name
        modifiedData.password = passwordNew
          ? bcrypt.hashSync(passwordNew, bcrypt.genSaltSync(10))
          : user.password
        modifiedData.introduction = introduction || user.introduction

        //deal with avatar、cover
        imgur.setClientID(IMGUR_CLIENT_ID)
        modifiedData.avatar = files && files.avatar ? await imgurUpload(files.avatar[0].path) : user.avatar
        modifiedData.cover = files && files.cover ? await imgurUpload(files.cover[0].path) : user.cover
        const newData = await user.update(modifiedData)
        res.status(200).json(newData)
      })
      .catch(error => res.status(500).json({
        status: 'error',
        message: error
      }))
  },
  login: (req, res) => {
    const { password, email } = req.body
    const options = {
      where: {
        email,
        role: 'user'
      },
      attributes: {
        include: [
          [
            sequelize.literal("(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)"),
            'followerNum'
          ],
          [
            sequelize.literal("(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)"),
            'followingNum'
          ],
          [
            sequelize.literal("(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = User.id)"),
            'likeNum'
          ],
          [
            sequelize.literal("(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)"),
            'tweetNum'
          ],
        ]
      }
    }
    if (!password || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Password or email can not be empty.'
      })
    }

    User.findOne(options)
      .then(async (user) => {
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
        let token = jwt.sign(payload, 'numberFive')
        user.lastLoginAt = new Date()
        await User.update(user.dataValues, {
          where: {
            id: user.dataValues.id
          }
        })
        return res
          .status(200)
          .json({
            status: 'success',
            message: 'User successfully login.',
            token,
            User: {
              id: user.id,
              name: user.name,
              account: user.account,
              email: user.email,
              role: user.role,
              avatar: user.avatar
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
