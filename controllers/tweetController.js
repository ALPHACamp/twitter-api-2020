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

const tweetController = {
  homePage: async (req, res) => {
    try{
      const id = req.user.id
      let userData = { ...req.user.dataValues, password: '', email: '' }

      // 取出所有推文 按照時間排序 包含推文作者以及按讚數
      const tweets = await sequelize.query('SELECT count(`Like`.`UserId`) AS`likeCount`, `Tweet`.`id` AS`tweetId`, `Tweet`.`description` AS`tweetDescription`, `Tweet`.`createdAt` AS`tweetCreate`, `User`.`account` AS `userAccount`, `User`.`name` AS `userName`, `User`.`avatar` AS `userAvatar`  FROM `Tweets` AS `Tweet` LEFT OUTER JOIN `Likes` AS `Like` ON`Like`.`TweetId` = `Tweet`.`id` LEFT OUTER JOIN `Users` AS `User` ON`Tweet`.`UserId` = `User`.`id` GROUP BY `TweetId`',
        {
          type: QueryTypes.SELECT,
          raw: true,
          nest: true,
        }
      )

      // 取出所有推文 按照時間排序 以及回復數
      const tweetsReply = await sequelize.query('SELECT count(`Reply`.`UserId`) AS`replyCount`, `Tweet`.`id` AS`tweetId` FROM `Tweets` AS `Tweet` LEFT OUTER JOIN `Replies` AS `Reply` ON`Reply`.`TweetId` = `Tweet`.`id` GROUP BY `TweetId`',
        {
          type: QueryTypes.SELECT,
          raw: true,
          nest: true,
        }
      )

      // 取出使用者跟蹤對象的清單
      let following = await Followship.findAll({
        where: { followerId: { [Op.eq]: id } },
        raw: true,
        nest: true
      })

      // 轉成陣列
      following = following.map(item => item = item['followingId'])

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
        return following.includes(element.userId) ? element['isFollowed'] = true : element['isFollowed'] = false
      })

      return res.json({ tweets, tweetsReply, popular, userData })
    }
    catch (error) {
      console.log(error)
    }
  }
}


module.exports = tweetController