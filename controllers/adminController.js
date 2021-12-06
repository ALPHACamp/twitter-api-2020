const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const sequelize = require('sequelize')
const { Op } = require("sequelize");

const adminController = {
  getUsers: (req, res) => {
    User.findAll({
      where: { role: { [Op.is]: null } },  // 排除管理者
      attributes: ['id', 'account', 'name', 'cover', 'avatar',
        [sequelize.literal(`(SELECT COUNT(Tweets.UserId) FROM Tweets INNER JOIN Likes ON Tweets.id = Likes.TweetId WHERE Tweets.UserId = User.id)`), 'LikedTweetCount'],
      ],
      include: [
        { model: User, as: 'Followers', attributes: ['id', 'account', 'name'] },  // User belongs to many User, through Followship
        { model: User, as: 'Followings', attributes: ['id', 'account', 'name'] },
        Tweet,  // OK ; User has many Tweets
      ],
    }).then(users => {
      users = users.map((user) => ({
        ...user.dataValues,
        Followers: user.Followers.length, //追蹤者人數
        Followings: user.Followings.length,  //追蹤其他使用者的人數
        TweetCount: user.Tweets.length,  // 推文數量
      }))
      users.forEach(user => { delete user.Tweets })
      users = users.sort((a, b) => b.TweetCount - a.TweetCount)
      return res.json(users)
    })
  },
  getAdminTweets: (req, res) => {
    Tweet.findAll({
      include: User,
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      tweets = tweets.map(tweet => ({
        id: tweet.id,
        description50: tweet.description.slice(0, 50),
        createdAt: tweet.createdAt,
        User: tweet.User
      }))
      return res.json(tweets)
    })
  },
  deleteTweet: (req, res) => {
    Tweet.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(tweet => {
        console.log(tweet)
        if (tweet === 1) {  //確實有刪除成功
          return res.json({ status: 'success', message: '刪除成功' })
        } //tweet = 0 表示找不到推文
        return res.json({ status: 'error', message: '找不到推文' })
      })
  }
}

module.exports = adminController