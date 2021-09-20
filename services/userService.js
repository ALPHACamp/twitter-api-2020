const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const { User, Tweet, Reply, Like, Followship, Sequelize } = require('../models')
const sequelize = require('sequelize')
const { helpers } = require('faker')

const userService = {
  signUp: async (account, name, email, password) => {
    const duplicate_email = await User.findOne({ where: { email } })
    if (duplicate_email) {
      return { status: 'error', message: 'This email has been registered' }
    }
    const duplicate_account = await User.findOne({ where: { account } })
    if (duplicate_account) {
      return {
        status: 'error',
        message: 'This account name has been registered',
      }
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
      return { status: 'error', message: 'no such user found' }
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return { status: 'error', message: 'passwords did not match' }
    }
    if (user.role === 'admin') {
      return {
        status: 'error',
        message: 'This account does not have permission to access',
      }
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
    if (user.role === 'admin') {
      return { status: 'error', message: "Can't access admin's profile" }
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
    return currentUser
  },
  putUser: async (id, files, body) => {
    const user = await User.findByPk(id)

    if (body.deleteCover) {
      await user.update({ cover: 'https://htmlcolorcodes.com/assets/images/colors/gray-color-solid-background-1920x1080.png' })
      console.log(user)
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
      return {
        status: 'error',
        message: "Couldn't find this user",
      }
    }
    if (user.role !== 'user') {
      return {
        status: 'error',
        message: 'Invalid user',
      }
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
      return {
        status: 'error',
        message: "Can't find this user",
      }
    }
    if (user.role !== 'user') {
      return {
        status: 'error',
        message: 'Invalid user',
      }
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
    if (!replies) {
      return {
        status: 'error',
        message: 'This user does not have any replies',
      }
    }
    return replies
  },
  getUserLikedTweets: async (id, currentUserId) => {
    const user = await User.findByPk(id)
    if (!user) {
      return {
        status: 'error',
        message: "Can't find this user",
      }
    }
    if (user.role !== 'user') {
      return {
        status: 'error',
        message: 'Invalid user',
      }
    }
    const tweets = await Tweet.findAll({
      include: [
        { model: Like, where: { UserId: id }, attributes: ['UserId'] },
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
      order: [['createdAt', 'DESC']],
    })

    return tweets
  },
  getFollowings: async (id, currentUserId) => {
    const user = await User.findByPk(id)
    if (!user) {
      return {
        status: 'error',
        message: "Can't find this user",
      }
    }
    if (user.role !== 'user') {
      return {
        status: 'error',
        message: 'Invalid user',
      }
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
      return {
        status: 'error',
        message: "Can't find this user",
      }
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
    const { account, name, email, password, checkPassword } = body
    const user = await User.findByPk(id)
    if (!user) {
      return { status: 'error', message: 'No such user found' }
    }
    if (!account || !name || !email ) {
      return { status: 'error', message: 'All fields are required' }
    }
    if (password) {
      if (password !== checkPassword) {
        return { status: 'error', message: 'Password & checkPassword does not match' }
      }
      await user.update({
        ...body,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      })
      return {
        status: 'success',
        message: 'Successfully edited including password'
      }
    }

    await user.update({
      ...body
    })
      
    return {
      status: 'success',
      message: 'Successfully edited'
    }
    
  }
}

module.exports = userService
