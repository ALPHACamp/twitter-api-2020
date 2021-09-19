const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Followship = db.Followship
const Like = db.Like
const Sequelize = db.Sequelize
const sequelize = db.sequelize
const Op = db.Sequelize.Op
const { QueryTypes } = require('sequelize')
// const popularQty = 10 //暫時沒有用到

const userController = {
  userHomePage: async (req, res) => {
    const userData = { ...req.user, password: '', email: '' }
    const userId = req.user.id
    const requestId = Number(req.params.id)
    try {
      const id = (userId === requestId) ? userId : requestId

      // 取出跟蹤使用者的清單
      let followers = await Followship.findAll({
        where: { followingId: { [Op.eq]: id } },
        raw: true,
        nest: true
      })

      // 轉成陣列
      followers = followers.map(item => item = item['followingId'])

      let isFollowed = false
      if (!(userId === requestId)) {
        followers.includes(userId) ? isFollowed = true : isFollowed
      } else {
        isFollowed = 'self'
      }

      userData.isFollowed = isFollowed
      
      return res.json(userData)
    }
    catch (error) {
      console.log(error)
    }
  },

  // 取出使用者資訊
  getUserInfo: async (req, res) => {
    const userId = req.user.id
    const requestId = Number(req.params.id)
    const id = userId === requestId ? userId : requestId
    const userData = await User.findByPk(id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'role'] },
      include: [
        { model: User, as: 'Followings', attributes: ['id'] },
        { model: User, as: 'Followers', attributes: ['id'] }
      ]
    })

    return res.json(userData)
  },

  //取出使用者發過的推文
  getUserTweets: async (req, res) => {
    const userId = req.user.id
    const requestId = Number(req.params.id)
    const id = userId === requestId? userId: requestId
    // 取出user所有推文
    const userTweets = await Tweet.findAll({
      where: { UserId: { [Op.eq]: id } },
      include: [
        { model: Reply, as: 'replies', attributes: ['id'] },
        { model: Like, as: 'likes', attributes: ['id'] }
      ],
    })
    return res.json(userTweets)
  },

  getRepliedTweets: async (req, res) => {
    const userId = req.user.id
    const requestId = Number(req.params.id)
    const id = userId === requestId ? userId : requestId
    // 取出user所有推文
    const repliedTweets = await Reply.findAll({
      where: { UserId: { [Op.eq]: id } },
      include: [
        { model: Tweet, as: 'tweet',
          include: [{ model: User, as: 'user', attributes: { exclude: ['password', 'email', 'introduction', 'cover', 'createdAt', 'updatedAt'] } }]
        },
      ]
    })

    return res.json(repliedTweets)
  },

  getLikes: async (req, res) => {
    const userId = req.user.id
    const requestId = Number(req.params.id)
    const id = userId === requestId ? userId : requestId
    try {
      // 取出user like的推文 並且包括推文作者
      const likedTweets = await Like.findAll({
        where: { UserId: { [Op.eq]: id } },
        include: [
          { model: Tweet, as: 'tweet', 
            include: [
              { model: User, as: 'user', attributes: { exclude: ['password', 'email', 'introduction', 'cover', 'createdAt', 'updatedAt'] }
              },
              { model: Like, as: 'likes', attributes: ['id'] },
              { model: Reply, as: 'replies', attributes: ['id'] }
            ]
        }]
      })

      return res.json(likedTweets)
    }
    catch (error) {
      console.log(error)
    }
  },

  getFollowings: async (req, res) => {
    const userId = Number(req.params.id)
    const followings = await Followship.findAll({
      where: { followerId: { [Op.eq]: userId } },
      include: [{ model: User, as: 'following', attributes: { exclude: ['password', 'email', 'introduction', 'cover', 'createdAt', 'updatedAt'] } }]
    })
    return res.json(followings)
  },

  getFollowers: async (req, res) => {
    const userId = Number(req.params.id)
    const followers = await Followship.findAll({
      where: { followingId: { [Op.eq]: userId } },
      include: [{ model: User, as: 'follower', attributes: { exclude: ['password', 'email', 'introduction', 'cover', 'createdAt', 'updatedAt'] } }]
    })
    return res.json(followers)
  },

  editUserData: async (req, res) => {
    try {
      const updateData = req.body
      const user = await User.update({ ...updateData })
      res.status(200).json({ user })
    }
    catch (error) {
      console.log(error)
    }
  }
}


module.exports = userController