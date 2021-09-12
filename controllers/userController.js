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
const popularQty = 10

const userController = {
  userHomePage: async (req, res) => {
    const userData = req.user
    try {
      const id = (req.user.id === req.params.id)? req.user.id: req.params.id
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

      // 取出user所有推文
      const userData = await User.findByPk(id, {
        include: [{ model: Tweet, as: 'userTweets' }],
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
      if (!(req.user.id === req.params.id)) {
        followers.includes(req.user.id) ? isFollowed = true : isFollowed
      } else {
        isFollowed = 'self'
      }
      
      return res.json({ userData, popular, isFollowed })
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
    
    return res.json({ userTweets })
  },

  getRepliedTweets: async (req, res) => {
    const userId = req.user.id
    const requestId = Number(req.params.id)
    const id = userId === requestId ? userId : requestId
    // 取出user所有推文
    const repliedTweets = await Reply.findAll({
      where: { UserId: { [Op.eq]: id } },
      include: [
        { model: Tweet, as: 'tweet' },
      ]
    })

    return res.json({ repliedTweets })
  },

  getLikes: async (req, res) => {
    const userId = req.user.id
    const requestId = Number(req.params.id)
    const id = userId === requestId ? userId : requestId
    try {
      const likedTweets = await User.findByPk(id, {
        include: [
          { model: Tweet, as: 'likingTweets' },
          // { model: Tweet, as: 'user' },
          // { model: Tweet, as: 'likeList' },
          // { model: Tweet, as: 'replyList' }
        ],
      })

      return res.json({ likedTweets })
    }
    catch (error) {

    }
  }
}


module.exports = userController