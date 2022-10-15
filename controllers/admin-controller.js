const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const sequelize = require('sequelize')
const { Tweet, User } = require('../models')

const adminController = {
  getUsers: (req, res, next) => {
    // GET /api/admin/users - 瀏覽使用者清單
    return User.findAll({
      attributes:[
        'id', 'account', 'name', 'avatar', 'backgroundImage',
        [sequelize.literal(`(SELECT COUNT (*) FROM Tweets WHERE Tweets.user_id = User.id)`), 'tweetCount'],
        [sequelize.literal(`(SELECT COUNT (*) FROM Likes WHERE Likes.user_id = User.id)`), 'likeCount'],
        [sequelize.literal(`(SELECT COUNT (*) FROM Followships WHERE Followships.follower_id = User.id)`), 'followingCount'],
        [sequelize.literal(`(SELECT COUNT (*) FROM Followships WHERE Followships.following_id = User.id)`), 'followerCount']
      ]
    })
    .then(users => {
      users = users.sort((a, b) => ( b.dataValues.tweetCount - a.dataValues.tweetCount ))
      res.status(200).json(users)
    })
    .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    // GET /api/admin/tweets - 瀏覽全站的 Tweet 清單
    return Tweet.findAll({
      attributes: { exclude: ['updatedAt', 'UserId'] },
      include: [{
        model: User,
        as: 'tweetAuthor',
        attributes: ['id', 'account', 'avatar', 'name']
      }],
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
    .then(tweets => {
      if(!tweets) throw new Error("There are no Tweets!")
      const data = tweets.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, 50)
      }))
      res.status(200).json(data)
    })
    .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    // DELETE /api/admin/tweets/:id - 刪除使用者的推文
    return Tweet.findByPk(req.params.id)
    .then(tweet => {
      if(!tweet) throw new Error("Tweet does not exist!")
      return tweet.destroy()
    })
    .then(data => {
    res.status(200).json({
      status: 'success',
      deleted_tweet: data
    })
  })
    .catch(err => next(err))
  },
  adminSignIn: (req, res, next) => {
    // POST /api/admin/signin - 管理者登入
    const { account, password } = req.body
    if (!account || !password) throw new Error('account and password are required!')
    return User.findOne({ where: { account } })
      .then(user => {
        if (!user) throw new Error('帳號不存在！')
        if (user.role !== 'admin') throw new Error('帳號不存在！')
        if (!bcrypt.compareSync(password, user.password)) throw new Error('incorrect account or password!')
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
        res.status(200).json({
          status: 'success',
          data: {
            token,
            user: userData
          }
        })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController