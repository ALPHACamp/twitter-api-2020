const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply
const sequelize = require('sequelize')
const { Op } = require("sequelize");

const adminController = {
  getUsers: (req, res) => {
    User.findAll({
      where: { role: { [Op.is]: null } },  // 排除管理者 { [Op.not]: 'admin' }
      attributes: ['id', 'account', 'name', 'cover', 'avatar',
        [sequelize.literal(`(SELECT COUNT(Tweets.UserId) FROM Tweets INNER JOIN Likes ON Tweets.id = Likes.TweetId WHERE Tweets.UserId = User.id)`), 'LikedTweetCount'],
      ],
      include: [
        { model: User, as: 'Followers', attributes: ['id', 'account', 'name'] },
        { model: User, as: 'Followings', attributes: ['id', 'account', 'name'] },
        Tweet,
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
      include: { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
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
    const TweetId = req.params.id
    Promise.all([
      Tweet.destroy({ where: { id: TweetId }}),
      Like.destroy({ where: { TweetId }}),
      Reply.destroy({ where: { TweetId }})
    ])
      .then(([ tweet, like, reply ]) => {
        // console.log([ tweet, like, reply ])
        if (tweet === 1) {  //確實有刪除成功
          return res.json({ status: 'success', message: '刪除成功' })
        } //tweet = 0 表示找不到推文
        return res.json({ status: 'error', message: '推文不存在' })
      })
  }
}

module.exports = adminController