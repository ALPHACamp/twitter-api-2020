const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Like, Sequelize, Reply } = require('../models')
const { Op } = Sequelize

let adminController = {
  adminLogin: async (req, res, next) => {
    try{
      const { email, password } = req.body
      // 檢查必要資料
      if (!email.trim() || !password.trim()) {
        return res.json({ status: 'error', message: "required fields didn't exist" })
      }
      const user = await User.findOne({ where: { email } })

      if (!user) return res.status(401).json({ status: 'error', message: 'No such user found' })
      if(user.role !== 'admin') return res.status(403).json({ status: 'error', message: '權限不足' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'Passwords did not match' })
      }
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
    }catch(err){
      next(err)
    }
  },
  getAdminTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        attributes: [
          'id','updatedAt',
          [Sequelize.literal('substring(description,1,50)'), 'description']
        ],
        include: [
          { model: User, attributes:['name', 'account', 'avatar'] }
        ],
        order: [['createdAt', 'DESC']]
      })
      return res.status(200).json({tweets})
    }catch(err){
      next(err)
    }
  },
  deleteAdminTweets: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: 'Can not find this tweet!'
        })
      }
      await tweet.destroy()
      await Reply.destroy({ where: { TweetId: tweet.id } })
      await Like.destroy({ where: { TweetId: tweet.id } })
      return res.status(200).json({
        status: 'success',
        message: 'delete successfully'
      })
    }catch(err){
      next(err)
    }
  },
  getAdminUsers: async (req, res, next) => {
    try{
    const user = await User.findAll({
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
      where: { role: { [Op.not]: 'admin' } },
    })
    return res.status(200).json([...user])

    }catch (err) {
      next(err)
    }
  }
}

module.exports = adminController