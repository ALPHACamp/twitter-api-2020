const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Sequelize = require('Sequelize')
const { Op } = require("sequelize");

const adminController = {
  getUsers: (req, res) => {
    User.findAll({
      where: { role: { [Op.is]: null } },  // 排除管理者
      attributes: ['id', 'account', 'name', 'cover', 'avatar'],
      include: [
        { model: User, as: 'Followers', attributes: ['id', 'account', 'name'] },  // User belongs to many User, through Followship
        { model: User, as: 'Followings', attributes: ['id', 'account', 'name'] },
        Tweet,  //User has many Tweets
      ],
    }).then(users => {
      users = users.map((user) => ({
        ...user.dataValues,
        Followers: user.Followers.length, //追蹤者人數
        Followings: user.Followings.length,  //追蹤其他使用者的人數
        TweetCount: user.Tweets.length,  // 推文數量
        // LikesCount: user.Likes.length  // 須改為推文"被"like的數量
        // TweetLikedCount: ,
      }))
      return res.json(users)
    })
  }
}

module.exports = adminController