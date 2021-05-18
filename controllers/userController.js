const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const db = require('../models')
const { sequelize } = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const {
  getFollowshipInfo,
  getResourceInfo,
  checkUserInfo,
  getUserInfoId
} = require('../utils/users')

// Upload image
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const uploadImg = path => {
  return new Promise((resolve, reject) => {
    imgur.upload(path, (err, img) => {
      if (err) {
        return reject(err)
      }
      resolve(img)
    })
  })
}

const userController = {
  login: async (req, res, next) => {
    // Make sure all the fields are filled out
    if (!req.body.account || !req.body.password) {
      return res.status(422).json({
        status: 'error',
        message: 'All fields are required.'
      })
    }

    try {
      // Check email and password
      const { account, password } = req.body

      const user = await User.findOne({ where: { account } })

      if (!user) {
        return res
          .status(401)
          .json({ status: 'error', message: 'That account does not exist.' })
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(401)
          .json({ status: 'error', message: 'Incorrect Password' })
      }

      // Sign token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success',
        message: 'login successfully',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          account: user.account,
          avatar: user.avatar,
          introduction: user.introduction,
          cover: user.cover,
          role: user.role
        }
      })
    } catch (error) {
      next(error)
    }
  },
  register: async (req, res, next) => {
    try {
      const result = await checkUserInfo(req)

      if (!result) {
        await User.create({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10),
            null
          ),
          role: 'user',
          avatar: 'https://i.imgur.com/q6bwDGO.png',
          cover: 'https://i.imgur.com/1jDf2Me.png'
        })

        return res.status(200).json({
          status: 'success',
          message: `${req.body.account} register successfully! Please login.`
        })
      }

      // All the required fields should be filled out correctly
      if (result.errors) {
        return res.status(422).json({
          status: 'error',
          errors: result.errors,
          userInput: req.body
        })
      }

      // email amd account should be unique
      if (result.value && result.key) {
        return res.status(409).json({
          status: 'error',
          message: `A user with ${result.value} already exists. Choose a different ${result.key}.`
        })
      }
    } catch (error) {
      next(error)
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      let users = await User.findAll({
        where: { role: 'user' },
        include: { model: User, as: 'Followers' },
        attributes: [
          'id',
          'name',
          'avatar',
          'account',
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'
            ),
            'followersCount'
          ]
        ],
        order: [[sequelize.literal('followersCount'), 'DESC']],
        limit: 6
      })

      // Clean up users data
      const followings = getUserInfoId(req, 'Followings')

      users = users.map(user => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        account: user.account,
        isFollowed: followings.includes(user.id)
      }))

      return res.status(200).json(users)
    } catch (error) {
      next(error)
    }
  },
  getUser: async (req, res, next) => {
    try {
      let user = await User.findByPk(req.params.id, {
        include: [
          Tweet,
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: User, as: 'Subscribers' }
        ]
      })

      // User can not see profile of admin or user that doesn't exist
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: 'user does not exist'
        })
      }

      // Clean up user data
      const subscriptions = getUserInfoId(req, 'Subscriptions')
      const followings = getUserInfoId(req, 'Followings')

      user = {
        id: user.id,
        name: user.name,
        email: user.email,
        account: user.account,
        avatar: user.avatar,
        introduction: user.introduction,
        cover: user.cover,
        role: user.role,
        tweetCount: user.Tweets.length,
        followerCount: user.Followers.length,
        followingCount: user.Followings.length,
        isFollowed: followings.includes(user.id),
        isSubscribed: subscriptions.includes(user.id)
      }

      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  },
  editUser: async (req, res, next) => {
    const userId = req.user.id
    const id = req.params.id
    const { name, introduction, page } = req.body

    // Users can only edit their own profile
    if (userId !== Number(id)) {
      return res
        .status(403)
        .json({ status: 'error', message: "You can not edit other's profile" })
    }

    let user = await User.findByPk(userId)

    try {
      // setting
      if (page === 'setting') {
        const result = await checkUserInfo(req)

        if (!result) {
          await user.update({
            account: req.body.account,
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10),
              null
            )
          })

          return res.status(200).json({
            status: 'success',
            message: `${page} update successfully`
          })
        }

        // All the required fields should be filled out correctly
        if (result.errors) {
          return res.status(422).json({
            status: 'error',
            errors: result.errors,
            userInput: req.body
          })
        }

        // email amd account should be unique
        if (result.value && result.key) {
          return res.status(409).json({
            status: 'error',
            message: `A user with ${result.value} already exists. Choose a different ${result.key}.`,
            userInput: req.body
          })
        }
      }

      // profile

      const errors = []
      const { files } = req
      const acceptedType = ['.png', '.jpg', '.jpeg']

      if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
        errors.push({
          message: 'Name can not be empty or longer than 50 characters'
        })
      }
      // Introduction can be empty
      if (introduction) {
        if (!validator.isByteLength(introduction, { min: 0, max: 160 })) {
          errors.push({
            message: 'Introduction can not be longer than 160 characters'
          })
        }
      }
      // Check image's type
      if (files) {
        for (const file in files) {
          const imgData = files[file][0]
          const fileType = imgData.originalname
            .substring(imgData.originalname.lastIndexOf('.'))
            .toLowerCase()

          if (acceptedType.indexOf(fileType) === -1) {
            errors.push({
              message: `${imgData.fieldname}'s image type is not accepted. Please upload the image ends with png, jpg, or jpeg.`
            })
          }
        }
      }

      if (errors.length > 0) {
        return res
          .status(422)
          .json({ status: 'error', errors, userInput: req.body })
      }

      // Images saved in /temp will be removed,
      // so we need to upload them to imgur
      const images = {}
      if (files) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        for (const key in files) {
          images[key] = await uploadImg(files[key][0].path)
        }
      }

      await user.update({
        name,
        introduction,
        avatar: images.avatar ? images.avatar.data.link : user.avatar,
        cover: images.cover ? images.cover.data.link : user.cover
      })

      return res.status(200).json({
        status: 'success',
        message: 'profile update successfully'
      })
    } catch (error) {
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      // Make sure user exists or is not admin
      const user = await User.findByPk(req.params.id, {
        include: [
          {
            model: Tweet,
            include: [Reply, Like]
          }
        ],
        order: [[sequelize.literal('`Tweets`.`createdAt`'), 'DESC']]
      })

      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: 'user does not exist'
        })
      }

      // Clean up tweets data
      const likes = getUserInfoId(req, 'LikedTweets')
      const tweets = user.dataValues.Tweets.map(tweet => ({
        id: tweet.id,
        description: tweet.description,
        createdAt: tweet.createdAt,
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length,
        isLiked: likes.includes(tweet.id)
      }))

      return res.status(200).json(tweets)
    } catch (error) {
      next(error)
    }
  },
  getRepliesAndTweets: async (req, res, next) => {
    try {
      // Make sure user exists or is not admin
      const user = await User.findByPk(req.params.id, {
        include: [
          {
            model: Reply,
            include: [{ model: Tweet, include: [Like, Reply, User] }]
          }
        ],
        order: [[sequelize.literal('`Replies`.`createdAt`'), 'DESC']]
      })

      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: 'user does not exist'
        })
      }

      // Clean up data
      const likes = getUserInfoId(req, 'LikedTweets')
      const replies = getResourceInfo(user, 'Replies', likes)

      return res.status(200).json(replies)
    } catch (error) {
      next(error)
    }
  },
  getLikes: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          {
            model: Like,
            include: [{ model: Tweet, include: [Like, Reply, User] }]
          }
        ],
        order: [[sequelize.literal('`Likes`.`createdAt`'), 'DESC']]
      })

      // Make sure user exists or is not admin
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: 'user does not exist'
        })
      }

      // Clean up data
      const currentUserLikes = getUserInfoId(req, 'LikedTweets')
      const likes = getResourceInfo(user, 'Likes', currentUserLikes)

      return res.status(200).json(likes)
    } catch (error) {
      next(error)
    }
  },
  getFollowers: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [{ model: User, as: 'Followers' }],
        order: [
          [sequelize.literal('`Followers->Followship`.`createdAt`'), 'DESC']
        ]
      })

      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: 'user does not exist'
        })
      }

      // Clean up followers info
      const currentUserFollowings = getUserInfoId(req, 'Followings')
      const followers = getFollowshipInfo(
        user,
        'Followers',
        currentUserFollowings
      )

      return res.status(200).json(followers)
    } catch (error) {
      next(error)
    }
  },
  getFollowings: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'Followings'
          }
        ],
        order: [
          [sequelize.literal('`Followings->Followship`.`createdAt`'), 'DESC']
        ]
      })

      // Make sure user exists or is not admin
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: 'user does not exist'
        })
      }

      // Clean up followings data
      const currentUserFollowings = getUserInfoId(req, 'Followings')
      const followings = getFollowshipInfo(
        user,
        'Followings',
        currentUserFollowings
      )

      return res.status(200).json(followings)
    } catch (error) {
      next(error)
    }
  },
  getCurrentUser: async (req, res) => {
    return res.status(200).json({
      id: req.user.id,
      name: req.user.name,
      account: req.user.account,
      email: req.user.email,
      avatar: req.user.avatar,
      role: req.user.role,
      cover: req.user.cover,
      introduction: req.user.introduction
    })
  }
}

module.exports = userController
