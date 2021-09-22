const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const { User, Tweet, Reply, Like, Followship, Sequelize } = require('../models')
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const apiError = require('../libs/apiError')


const userService = {
  signUp: async (account, name, email, password) => {
    const duplicate_email = await User.findOne({ where: { email } })
    if (duplicate_email) {
      throw apiError.badRequest(400, 'This email has been registered')
    }
    const duplicate_account = await User.findOne({ where: { account } })
    if (duplicate_account) {
      throw apiError.badRequest(400, 'This account name has been registered')
    }

    const newUser = await User.create({
      account,
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    })
    return { status: 'success', message: 'Successfully sign up' }
  },
  signIn: async (account, password) => {
    const user = await User.findOne({ where: { account } })
    if (!user) {
      throw apiError.badRequest(404, 'User does not exist')
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw apiError.badRequest(403, 'Password incorrect')
    }
    if (user.role === 'admin') {
      throw apiError.badRequest(403, 'Access denied due to role')
    }
    // Give token
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET)

    return {
      status: 'success',
      message: 'Successfully login',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  },
  getUser: async (userId, currentUserId) => {
    const user = await User.findOne({
      raw: true,
      nest: true,
      where: { id: userId },
      attributes: [
        'id',
        'account',
        'name',
        'avatar',
        'cover',
        'introduction',
        'role',
        [Sequelize.literal(`(SELECT COUNT(*) FROM TWEETS WHERE Tweets.UserId = ${userId})`), 'TweetsCount'],
        [Sequelize.literal(`(SELECT COUNT(*) FROM FOLLOWSHIPS WHERE Followships.followingId = ${userId})`), 'FollowersCount'],
        [Sequelize.literal(`(SELECT COUNT(*) FROM FOLLOWSHIPS WHERE Followships.followerId = ${userId})`), 'FollowingCount'],
        [
          Sequelize.literal(`exists(SELECT 1 FROM Followships WHERE followerId = ${currentUserId} and followingId = User.id )`),
          'isFollowed',
        ],
      ],
    })
    if (!user) {
      throw apiError.badRequest(404, 'User does not exist')
    }
    if (user.role === 'admin') {
      throw apiError.badRequest(403, 'Access denied due to role')
    }

    return user
  },
  getCurrentUser: async (userId) => {
    const currentUser = await User.findOne({
      raw: true,
      nest: true,
      where: { id: userId },
      attributes: [
        'id',
        'account',
        'name',
        'email',
        'avatar',
        'cover',
        'introduction',
        'role',
        [Sequelize.literal(`(SELECT COUNT(*) FROM TWEETS WHERE Tweets.UserId = ${userId})`), 'TweetsCount'],
        [Sequelize.literal(`(SELECT COUNT(*) FROM FOLLOWSHIPS WHERE Followships.followingId = ${userId})`), 'FollowersCount'],
        [Sequelize.literal(`(SELECT COUNT(*) FROM FOLLOWSHIPS WHERE Followships.followerId = ${userId})`), 'FollowingCount'],
      ],
    })
    currentUser.isCurrent = true
    if (!currentUser) {
      throw apiError.badRequest(404, 'User does not exist')
    }
    return currentUser
  },
  putUser: async (id, files, body) => {
    const user = await User.findByPk(id)
    if (body.deleteCover) {
      await user.update({ cover: 'https://htmlcolorcodes.com/assets/images/colors/gray-color-solid-background-1920x1080.png' })
    }

    if (files) {
      imgur.setClientId(IMGUR_CLIENT_ID)
      const avatar = files.avatar ? await imgur.uploadFile(files.avatar[0].path) : null
      const cover = files.cover ? await imgur.uploadFile(files.cover[0].path) : null

      await user.update({
        ...body,
        avatar: files.avatar ? avatar.link : user.avatar,
        cover: files.cover ? cover.link : user.cover,
      })
      return {
        status: 'success',
        message: 'Successfully edited',
      }
    }
    await user.update({ ...body, avatar: user.avatar, cover: user.cover })
    return { status: 'success', message: 'successfully edited' }
  },
  getUserTweets: async (id, currentUserId) => {
    const user = await User.findByPk(id)
    if (!user) {
      throw apiError.badRequest(404, 'User does not exist')
    }
    if (user.role !== 'user') {
      throw apiError.badRequest(403, 'Invalid user')
    }
    return await Tweet.findAll({
      where: { UserId: id },
      attributes: [
        ['id', 'TweetId'],
        'description',
        'createdAt',
        [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'RepliesCount'],
        [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'LikesCount'],
        [Sequelize.literal(`exists(SELECT 1 FROM Likes WHERE UserId = ${currentUserId} and TweetId = Tweet.id)`), 'isLike'],
      ],
      include: [{ model: User, attributes: ['id', 'avatar', 'name', 'account'] }],
      order: [['createdAt', 'DESC']],
    })
  },
  getUserRepliedTweets: async (id, currentUserId) => {
    const user = await User.findByPk(id)
    if (!user) {
      throw apiError.badRequest(404, 'User does not exist')
    }
    if (user.role !== 'user') {
      throw apiError.badRequest(403, 'Invalid user')
    }
    const replies = await Reply.findAll({
      where: { UserId: id },
      include: [
        {
          model: Tweet,
          attributes: [
            'id',
            'description',
            [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'RepliesCount'],
            [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'LikesCount'],
            [Sequelize.literal(`exists(SELECT 1 FROM Likes WHERE UserId = ${currentUserId} and TweetId = Tweet.id)`), 'isLike'],
          ],
          include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        },
        { model: User, attributes: ['id', 'name', 'avatar', 'account'] },
      ],
      attributes: ['id', 'comment', 'createdAt'],
      order: [['createdAt', 'DESC']],
    })

    return replies
  },
  getUserLikedTweets: async (id, currentUserId) => {
    const user = await User.findByPk(id)
    if (!user) {
      throw apiError.badRequest(404, 'User does not exist')
    }
    if (user.role !== 'user') {
      throw apiError.badRequest(403, 'Invalid user')
    }
    const tweets = await Tweet.findAll({
      include: [
        { model: Like, where: { UserId: id } },
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
      ],
      attributes: [
        ['id', 'TweetId'],
        'description',
        'createdAt',
        [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'RepliesCount'],
        [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'LikesCount'],
        [Sequelize.literal(`exists(SELECT 1 FROM Likes WHERE UserId = ${currentUserId} and TweetId = Tweet.id)`), 'isLike'],
      ],
      order: [[sequelize.literal('`Likes`.`createdAt`'), 'DESC']],
    })

    return tweets
  },
  getFollowings: async (id, currentUserId) => {
    const user = await User.findByPk(id)
    if (!user) {
      throw apiError.badRequest(404, 'User does not exist')
    }
    if (user.role !== 'user') {
      throw apiError.badRequest(403, 'Invalid user')
    }
    const followings = await User.findAll({
      include: [
        {
          model: User,
          as: 'Followers',
          where: { id },
          attributes: ['id'],
        },
      ],
      attributes: [
        ['id', 'followingId'],
        'name',
        'avatar',
        'account',
        'introduction',
        [
          Sequelize.literal(`exists(SELECT 1 FROM Followships WHERE followerId = ${currentUserId} and followingId = User.id )`),
          'isFollowed',
        ],
      ],
      order: [[sequelize.literal('`Followers->Followship`.`createdAt`'), 'DESC']],
    })
    return followings
  },
  getFollowers: async (id, currentUserId) => {
    const user = await User.findByPk(id)
    if (!user) {
      throw apiError.badRequest(404, 'User does not exist')
    }
    if (user.role !== 'user') {
      throw apiError.badRequest(403, 'Invalid user')
    }
    const followers = await User.findAll({
      include: [
        {
          model: User,
          as: 'Followings',
          where: { id },
          attributes: ['id'],
        },
      ],
      attributes: [
        ['id', 'followerId'],
        'name',
        'avatar',
        'account',
        'introduction',
        [
          Sequelize.literal(`exists(SELECT 1 FROM Followships WHERE followerId = ${currentUserId} and followingId = User.id )`),
          'isFollowed',
        ],
      ],
      order: [[sequelize.literal('`Followings->Followship`.`createdAt`'), 'DESC']],
    })
    return followers
  },
  getTopUsers: async (currentUserId) => {
    const topUsers = await User.findAll({
      where: { role: 'user' },
      include: [{ model: User, as: 'Followers', attributes: [] }],
      attributes: [
        'id', 
        'name', 
        'account', 
        'avatar', 
        'introduction', 
        [
          Sequelize.literal(`(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)`),
          'FollowersCount'
        ],
        [
          Sequelize.literal(`exists(SELECT 1 FROM Followships WHERE followerId = ${currentUserId} and followingId = User.id)`),
          'isFollowed'
        ]
      ],
      order: [[Sequelize.col('FollowersCount'), 'DESC']],
      limit: 10
    })
    return topUsers
  },
  putUserSettings: async (id, body) => {
    const { account, email, password } = body
    
    if (email) {
      const duplicate_email = await User.findOne({
        where: { id: { [Op.not]: id }, email },
      })
      if (duplicate_email) {

        throw apiError.badRequest(400, 'This email has been registered')

      }
    }
    
    if (account) {
      const duplicate_account = await User.findOne({
        where: { id: { [Op.not]: id }, account },
      })
      if (duplicate_account) {

        throw apiError.badRequest(400, 'This account name has been registered')

      }
    }
    const user = await User.findByPk(id)
    if (!user) {
      throw apiError.badRequest(404, 'User does not exist')
    }

    if (password) {
      await user.update({
        ...body,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      })
      return {
        status: 'success',
        message: 'Successfully edited including password',
      }
    }

    await user.update({
      ...body,
      password: user.password,
    })

    return {
      status: 'success',
      message: 'Successfully edited',
    }
  }
}

module.exports = userService
