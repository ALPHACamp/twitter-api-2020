const jwt = require('jsonwebtoken')
const { User, Tweet } = require('../models')
const { getUser } = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { Op, Sequelize } = require('sequelize')
const bcrypt = require('bcryptjs')
const nodemailer = require('../config/nodemailer')

const userController = {
  signIn: (req, res, next) => {
    const { from } = req.query
    if (!from) {
      res
        .status(403)
        .json(
          'Pls insert ?from=back or ?from=front at urls to let me know which way you want to sign!'
        )
    }
    if (req.authInfo && req.authInfo.message) return res.status(400).json(req.authInfo.message)
    const userData = getUser(req).toJSON()
    if (
      (userData.role === 'user' && from === 'front') ||
        (userData.role === 'admin' && from === 'back')
    ) {
      if (!userData) return res.status(200).json('account or password incorrect!')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '7d'
      })
      return res.status(200).json({ token, userData })
    } else {
      res
        .status(401)
        .json(
            `I'm sorry, but access to the ${from}stage area is restricted.`
        )
    }
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) { return res.status(200).json('Password do not match!') }
    if (name.length > 50) return res.status(200).json('Max length 50')
    return Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([emailCheck, accountCheck]) => {
        if (emailCheck) return res.status(200).json('Email already exists!')
        if (accountCheck) { return res.status(200).json('Account already exists!') }
        return Promise.all([
          bcrypt.hash(password, 10),
          jwt.sign({ email: req.body.email }, process.env.JWT_SECRET)
        ])
      })
      .then(([hash, confirmToken]) =>
        User.create({
          account,
          name,
          email,
          password: hash,
          role: 'user',
          confirmToken
        })
      )
      .then(() => {
        res.status(200).json('Create success')
      })
      .catch((err) => next(err))
  },
  getUser: (req, res, next) => {
    const userId = req.params.id
    Promise.all([
      User.findOne({
        where: { id: userId },
        raw: true
      }),
      Tweet.findAll({
        where: { UserId: userId },
        raw: true
      })
    ])
      .then(([data, tweets]) => {
        if (!data) return res.status(404).json('User not found!')
        delete data.password
        data.tweetsCounts = tweets.length
        data.isFollowing = req.user.Followings
          ? req.user.Followings.some((f) => Number(f.id) === Number(userId))
          : false
        res.status(200).json(data)
      })
      .catch((err) => next(err))
  },
  putUser: (req, res, next) => {
    const handleFileUpload = async () => {
      let fileData = null

      if (req.files) {
        const { avatar, coverPhoto } = req.files
        let avatarPath, coverPhotoPath

        if (avatar) avatarPath = await imgurFileHandler(avatar[0])
        if (coverPhoto) coverPhotoPath = await imgurFileHandler(coverPhoto[0])

        fileData = {
          avatar: avatarPath,
          coverPhoto: coverPhotoPath
        }
      }

      if (Object.keys(req.query).length !== 0) {
        const { avatar, coverPhoto } = req.query
        let avatarPath, coverPhotoPath

        if (avatar) avatarPath = null
        if (coverPhoto) coverPhotoPath = null

        fileData = {
          avatar: avatarPath,
          coverPhoto: coverPhotoPath
        }
      }

      return fileData
    }

    const updateUser = (fileData) => {
      return new Promise((resolve, reject) => {
        const userId = Number(req.user.id) || Number(getUser(req).dataValues?.id)
        const paramsUserId = Number(req.params.id)

        if (paramsUserId !== userId) {
          return res.status(403).json('Can not change others data')
        }

        const userAccount = req.user.account
        const userEmail = req.user.email
        const { account, name, email, password, checkPassword, introduction } = req.body

        if (name?.length > 50) return res.status(400).json('max length 50')
        if (introduction?.length > 160) return res.status(400).json('max length 160')
        if (password !== checkPassword) {
          return res.status(400).json('Password do not match!')
        }

        Promise.all([
          User.findAll({ attributes: ['account', 'email'] }),
          User.findByPk(userId)
        ])
          .then(async ([users, userdata]) => {
            const accountList = users.map((user) => user.account)
            const emailList = users.map((user) => user.email)
            accountList.splice(accountList.indexOf(userAccount), 1)
            emailList.splice(emailList.indexOf(userEmail), 1)

            if (accountList.includes(account)) {
              return res.status(400).json('This account has been used!')
            }
            if (emailList.includes(email)) {
              return res.status(400).json('This email has been used!')
            }

            let hash
            if (password) {
              hash = await bcrypt.hash(password, 10)
            }
            const data = {
              account,
              name,
              introduction,
              email,
              password: hash || userdata.password,
              ...fileData
            }
            return userdata.update(data)
          })
          .then(() => {
            resolve('update success')
          })
          .catch((err) => {
            reject(err)
          })
      })
    }

    handleFileUpload()
      .then(updateUser)
      .then((result) => {
        return res.status(200).json(result)
      })
      .catch((err) => {
        next(err)
      })
  },
  deleteUser: (req, res, next) => {
    const userId = req.params.id
    // 別人也能刪除自己 需更動passport
    User.findByPk(userId)
      .then((user) => {
        if (!user) return res.status(404).json('User not found')
        user.destroy()
      })
      .then(() => {
        res.status(200).json('Delete success')
      })
      .catch((err) => next(err))
  },
  getTopUsers: (req, res, next) => {
    const userId = req.user.id || getUser(req).dataValues.id
    User.findOne({
      where: { account: 'root' },
      attributes: ['id'],
      raw: true
    })
      .then((root) => {
        if (!root) return res.status(404).json('Root not found')
        return User.findAll({
          where: {
            id: {
              [Op.not]: [root.id, userId]
            }
          },
          attributes: [
            'id',
            'account',
            'name',
            'email',
            'introduction',
            'avatar',
            'role',
            'createdAt',
            'updatedAt',
            [Sequelize.literal('(SELECT COUNT(*) FROM `Followships` WHERE `Followships`.`following_Id` = `User`.`id`)'), 'followerCount']
          ],
          include: [
            {
              model: User,
              as: 'Followers'
            }
          ],
          order: [[Sequelize.literal('followerCount'), 'DESC']],
          limit: [10]
        })
      })
      .then((users) => {
        const data = users
          .map((user) => ({
            ...user.toJSON(),
            isFollowing: req.user.Followings
              ? req.user.Followings.some((f) => f.id === user.id)
              : false
          }))
        const final = data.map(({ Followers, ...rest }) => rest)
        res.status(200).json(final)
      })
      .catch((err) => next(err))
  },
  sendVertifyEmail: (req, res, next) => {
    const userId = req.user.id || getUser(req).dataValues.id
    const protocol = req.protocol
    const hostname = req.hostname
    const PORT = process.env.PORT || 3000
    const serverDomain = `${protocol}://${hostname}:${PORT}`
    User.findByPk(userId, { attributes: ['name', 'confirmToken', 'email'] })
      .then((user) => {
        if (!user) return res.status(404).json('User not found')
        return nodemailer.sendConfirmationEmail(user.name, user.email, user.confirmToken, serverDomain)
      })
      .then(() => res.status(200).json('Send success'))
      .catch((err) => next(err))
  },
  confirmEmail: (req, res, next) => {
    const token = req.params.token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // The token is invalid
        res.status(403).json('Invalid confirmation token')
      } else {
        // The token is valid
        const email = decoded.email
        // Update the user's status
        User.findOne({ where: { email } })
          .then((user) => {
            if (!user) return res.status(404).json('User not found')
            // Update the user's status
            user.status = 'Active'
            return user.save()
          })
          .then(() => {
            res.status(200).json('Your email has been confirmed!')
          })
          .catch((err) => next(err))
      }
    })
  }
}

module.exports = userController
