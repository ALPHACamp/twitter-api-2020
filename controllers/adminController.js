const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Like, Sequelize, Reply } = require('../models')
const { Op } = Sequelize

let adminController = {
  adminLogin: (req, res) => {
    const { email, password } = req.body

    // 檢查必要資料
    if (!email.trim() || !password.trim()) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }

   // 檢查 user 是否存在與密碼是否正確
    User.findOne({ where: { email } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }

      //確定只有admin通過
      if(user.role !== 'admin') return res.status(403).json({ status: 'error', message: '權限不足' })

      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success',
        message: 'login successfully',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      })
    })
  },
  getAdminTweets: (req, res, next) => {
    Tweet.findAll({ 
      attributes: [
        'id','updatedAt',
        [Sequelize.literal('substring(description,1,50)'), 'description']
      ],
      include: [
        { model: User, attributes:[
          'name', 'account', 'avatar'
        ]}
      ],
      order: [['createdAt', 'DESC']]
    }).then((tweets) => {
      return res.status(200).json({tweets})
    })
    .catch(err => next(err))
  },
  deleteAdminTweets: (req, res, next) => {
    console.log('delete', req.params.id)
    Tweet.findByPk(req.params.id)
      .then((tweet) => {
        if (!tweet) {
          return res.status(404).json({
            status: 'error',
            message: 'Can not find this tweet!'
          })
        }
        Promise.all([
          tweet.destroy(),
          Reply.destroy({ where: { TweetId: tweet.id } }),
          Like.destroy({ where: { TweetId: tweet.id } })
        ])
          .then(() => {
            res.status(200).json({
              status: 'success',
              message: 'delete successfully'
            })
          }).catch(err => next(err))
      }).catch(err => next(err))
  },
  getAdminUsers: (req, res, next) => {
    
    //粉絲、跟隨、推文被 like、Reply 的數量
    User.findAll({
      attributes: [
        'id','name', 'account', 'cover', 'avatar',
        [Sequelize.literal('COUNT(distinct Tweets.id)'), 'TweetsCount'],
        [Sequelize.literal('COUNT(distinct Likes.id)'), 'LikesCount'],
        [Sequelize.literal('COUNT(DISTINCT Followers.id)'), 'followersCount'],
        [Sequelize.literal('COUNT(DISTINCT Followings.id)'), 'followingsCount'] 
      ],
      group: 'id',
      include: [
        { model: Tweet, attributes: [] },
        { model: Like, attributes: [] },
        { model: User, as: 'Followers' , attributes: []},
        { model: User, as: 'Followings' , attributes: []},
      ],
      order: [
        [Sequelize.literal('TweetsCount'), 'DESC']
      ],
      where: { role: { [Op.not]: 'admin' } },//不會顯示admin
    })
      .then((users) => {
        return res.status(200).json([...users])
      }).catch(err => next(err))
  }
}

module.exports = adminController