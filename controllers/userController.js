const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJWT = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const moment = require('moment')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const db = require('../models')
const { User, Tweet, Reply, Like, Followship } = db

const userController = {
  register: (req, res) => {
    const { account, name, email, password, passwordConfirm } = req.body
    const errors = []
    if (!account && !name && !email && !password && !passwordConfirm) {
      errors.push({ status: 'error', message: 'all columns are empty' })
    } else if (!account) {
      errors.push({ status: 'error', message: 'account is empty' })
    } else if (!name) {
      errors.push({ status: 'error', message: 'name is empty' })
    } else if (!email) {
      errors.push({ status: 'error', message: 'email is empty' })
    } else if (!password) {
      errors.push({ status: 'error', message: 'password is empty' })
    } else if (!passwordConfirm) {
      errors.push({ status: 'error', message: 'passwordConfirm is empty' })
    } else if (password !== passwordConfirm) {
      errors.push({ status: 'error', message: 'password or passwordConfirm is incorrect' })
    }
    if (errors.length) return res.json(...errors);

    User.findOne({ where: { account } })
      .then(userOwnedAccount => {
        if (userOwnedAccount) {
          return res.json({ status: 'error', message: 'this account is registered' })
        }
        return User.findOne({ where: { email } })
          .then(userOwnedEmail => {
            if (userOwnedEmail) {
              return res.json({ status: 'error', message: 'this email is registered' })
            }
            return User.create({
              account,
              name,
              email,
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
              role: 'user'
            })
          })
          .then(() => res.json({ status: 'success', message: 'register successfully' }))
          .catch(err => console.log(err))
      }).catch(err => console.log(err))
  },

  login: (req, res) => {
    // check input
    const { account, password } = req.body
    const errors = []
    if (!account && !password) {
      errors.push({ status: 'error', message: 'all columns are empty' })
    } else if (!account) {
      errors.push({ status: 'error', message: 'account is empty' })
    } else if (!password) {
      errors.push({ status: 'error', message: 'password is empty' })
    }
    if (errors.length) return res.json(...errors);

    // check user login info
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) return res.json({ status: 'error', message: `can not find user "${user}"` })
        if (!bcrypt.compareSync(password, user.password)) {
          return res.json({ status: 'error', message: 'account or password is incorrect' })
        }

        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.json({
          status: 'success',
          message: 'ok',
          token,
          user: {
            id: user.id,
            account: user.account,
            name: user.name,
            email: user.email,
            role: user.role
          }
        })
      })
  },

  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      order: [
        [{ model: Tweet }, 'createdAt', 'DESC'],
        [{ model: Reply }, 'createdAt', 'DESC'],
        [{ model: Like }, 'createdAt', 'DESC'],
      ],
      include: [
        { model: Tweet, include: [Like, Reply] },
        { model: Reply, include: [Tweet] },
        { model: Like, include: [Tweet] },
      ]
    }).then(user => {
      return res.json({
        user: user,
        tweetCounts: user.Tweets.length,
      })
    })
  },

  putUser: (req, res) => {
    let { account, name, email, password, passwordConfirm, introduction } = req.body
    const { id } = req.params

    //check user
    if (req.user.id === Number(id)) {

      if (!req.files) {
        // user edit profile page without image
        if (name || introduction && !account && !email && !password && !passwordConfirm) {
          return User.findByPk(id)
            .then(user => {
              user.update({
                name: name || user.name,
                introduction: introduction || user.introduction
              })
              return res.json({ status: 'success', message: 'user profile updated successfully' })
            }).catch(err => console.log(err))
        }

        // 不能有空白
        if (account) account = account.replace(/\s*/g, "")
        if (email) email = email.replace(/\s*/g, "")

        // user edit account page
        if (account || email || password || passwordConfirm || name && !introduction) {
          return User.findByPk(id)
            .then(user => {
              if (account && account !== user.account) {
                return User.findOne({ where: { account } })
                  .then(userAccount => {
                    if (userAccount) return res.json({ status: 'error', message: `account "${account}" is registered` })
                  })
              }

              if (email && email !== user.email) {
                return User.findOne({ where: { email } })
                  .then(userEmail => {
                    if (userEmail) return res.json({ status: 'error', message: `"email ${email}" is registered` })
                  })
              }

              if (password || passwordConfirm) {
                if (password !== passwordConfirm) return res.json({ status: 'error', message: 'password or passwordConfirm is incorrect' })
                user.update({
                  account: account || user.account,
                  name: name || user.name,
                  email: email || user.email,
                  password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
                })
                return res.json({ status: 'success', message: 'user account updated successfully' })
              }

              user.update({
                account: account || user.account,
                name: name || user.name,
                email: email || user.email
              })
              return res.json({ status: 'success', message: 'user account updated successfully' })
            }).catch(err => console.log(err))
        }



      }

      if (req.files) {
        const uploadAvatarImage = new Promise((resolve, reject) => {
          let imageURL = { avatar: '' }
          imgur.setClientID(IMGUR_CLIENT_ID)
          // upload avatar image
          if (req.files.avatar) {
            imgur.upload(req.files.avatar[0].path, (err, img) => {
              if (err) return reject(err)
              imageURL.avatar = img.data.link
              resolve(imageURL)
            })
          } else {
            imageURL.avatar = null
            resolve(imageURL)
          }
        })

        const uploadCoverImage = new Promise((resolve, reject) => {
          let imageURL = { cover: '' }
          imgur.setClientID(IMGUR_CLIENT_ID)
          // upload cover image
          if (req.files.cover) {
            imgur.upload(req.files.cover[0].path, (err, img) => {
              if (err) return reject(err)
              // if (err) {
              //   console.log(`[ERROR]: ${err}`)
              //   return res.json({ status: 'error', message: 'something wrong when uploading to imgur' })
              // }
              imageURL.cover = img.data.link
              resolve(imageURL)
            })
          } else {
            imageURL.cover = null
            resolve(imageURL)
          }
        })

        async function updateUser() {
          // user edit profile page and upload image
          let avatarURL = ''
          let coverURL = ''
          if (req.files.avatar) {
            avatarURL = await uploadAvatarImage
              .catch(err => console.log(err))
          }
          if (req.files.cover) {
            coverURL = await uploadCoverImage
              .catch(err => console.log(err))
          }
          console.log(avatarURL, coverURL)
          return User.findByPk(id)
            .then(user => {
              user.update({
                name: name || user.name,
                introduction: introduction || user.introduction,
                avatar: avatarURL.avatar || user.avatar,
                cover: coverURL.cover || user.cover
              })
              return res.json({ status: 'success', message: 'user profile updated successfully' })
            }).catch(err => console.log(err))
        }
        // user edit profile page with image
        updateUser()
      }

    } else {
      return res.json({ status: "error", "message": "permission denied" })
    }



  },

  getFollowers: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followers' }]
    }).then(user => {
      const data = user.Followers.map(r => ({
        ...r.dataValues,
        isFollowing: req.user.Followings.map(d => d.id).includes(r.id)
      }))
      return res.json({
        user: data,
      })
    })
  },

  getFollowings: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followings' }]
    }).then(user => {
      const data = user.Followings.map(r => ({
        ...r.dataValues,
        isFollowing: req.user.Followings.map(d => d.id).includes(r.id)
      }))
      return res.json({
        user: data
      })
    })
  },

  addFollowing: (req, res) => {
    if (Number(req.user.id) !== Number(req.params.userId)) {
      return Followship.create({
        followerId: req.user.id,
        followingId: req.params.userId
      })
        .then((followship) => {
          res.json({ status: 'success', message: '' })
        })
    }
    else {
      res.json({ status: 'error', message: '不能追蹤自己' })
    }

  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            res.json({ status: 'success', message: '' })
          })
      })
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      TweetId: req.params.tweetId
    })
      .then((like) => {
        res.json({ status: 'success', message: '' })
      })
  },
  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        TweetId: req.params.tweetId
      }
    })
      .then((like) => {
        like.destroy()
          .then((like) => {
            res.json({ status: 'success', message: '' })
          })
      })
  },

  getTopUsers: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
      return res.json({
        users: users
      })
    })
  },
}
module.exports = userController