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
      // 取出使用者跟蹤對象的清單
      let followings = await Followship.findAll({
        where: { followerId: { [Op.eq]: id } },
        raw: true,
        nest: true
      })

      // 取出跟蹤使用者的清單
      let followers = await Followship.findAll({
        where: { followingId: { [Op.eq]: id } },
        raw: true,
        nest: true
      })

      // 轉成陣列
      followings = followings.map(item => item = item['followingId'])
      followers = followers.map(item => item = item['followingId'])

      //取出user所有推文 含按讚 含回覆
      const userTweets = await Tweet.findAll({
        where: { UserId: { [Op.eq]: id } },
        include: [
          { model: Reply, as: 'replies' },
          { model: Like, as: 'likes' }
        ]
      })

      // 取出最多人追蹤的使用者 按照追蹤人數排序
      const popular = await sequelize.query('SELECT count(`followerId`) AS`followCount`, `User`.`id` AS`userId`, `User`.`avatar` AS`avatar`, `User`.`account` AS`account`, `User`.`name` AS`name` FROM `Followships` AS `Followship` LEFT OUTER JOIN `Users` AS `User` ON`Followship`.`followingId` = `User`.`id` GROUP BY `followingId` ORDER BY followCount DESC LIMIT 10',
        {
          type: QueryTypes.SELECT,
          raw: true,
          nest: true,
        }
      )

      // 送出前整理一下 標出使用者有追蹤的其他用戶
      popular.map(element => {
        return followings.includes(element.userId) ? element['isFollowed'] = true : element['isFollowed'] = false
      })
      
      let isFollowed = false
      if (!(userId === requestId)) {
        followers.includes(userId) ? isFollowed = true : isFollowed
      } else {
        isFollowed = 'self'
      }
      
      return res.json({ userData, userTweets, popular, isFollowed })
    }
    catch (error) {
      console.log(error)
    }
  },

  getUserTweets: async (req, res) => {
    const userId = req.user.id
    const requestId = Number(req.params.id)
    const id = userId === requestId? userId: requestId
    // 取出user所有推文
    const userTweets = await Tweet.findAll({
      where: { UserId: { [Op.eq]: id } },
      include: [
        { model: Reply, as: 'replies' },
        { model: Like, as: 'likes' }
      ],
    })
    // let userData = await User.findByPk(userId)
    // userData = { ...req.user.dataValues, password: '', email: '' }
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

    return res.json({ repliedTweets })
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
            include: [{ model: User, as: 'user', attributes: { exclude: ['password', 'email', 'introduction', 'cover', 'createdAt', 'updatedAt'] }
            }]
        }]
      })

      // 統計所有推文按讚數
      const likeStatistic = await Like.findAll({
        attributes: ['TweetId', [sequelize.fn('count', sequelize.col('UserId')), 'likeCount']],
        group: ['TweetId']
      })

      // 統計所有推文回覆數
      const replyStatistic = await Reply.findAll({
        attributes: ['TweetId', [sequelize.fn('count', sequelize.col('UserId')), 'replyCount']],
        group: ['Reply.TweetId']
      }) 

      return res.json({ likedTweets, likeStatistic, replyStatistic })
    }
    catch (error) {
      console.log(error)
    }
  },

  getFollowings: async (req, res) => {
    let data = []
    const userId = req.user.id
    const followings = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'email', 'introduction', 'cover', 'createdAt', 'updatedAt'] },
      include: [{ model: User, as: 'Followings', attributes: { exclude: ['password', 'email', 'introduction', 'cover', 'createdAt', 'updatedAt'] } }]
    })
    data.push(followings)
    const followersId = await Followship.findAll({
      where: { followingId: { [Op.eq]: userId } },
    })
    data.push(followersId)
    return res.json(data)
  },

  getFollowers: async (req, res) => {
    let data = []
    const userId = req.user.id
    const followers = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'email', 'introduction', 'cover', 'createdAt', 'updatedAt'] },
      include: [{ model: User, as: 'Followers', attributes: { exclude: ['password', 'email', 'introduction', 'cover', 'createdAt', 'updatedAt'] } }]
    })
    data.push(followers)
    const followingsId = await Followship.findAll({
      where: { followerId: { [Op.eq]: userId } },
    })
    data.push(followingsId)
    return res.json(data)
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