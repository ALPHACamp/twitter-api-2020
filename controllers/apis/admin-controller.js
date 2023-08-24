const bcrypt = require('bcryptjs')
const db = require('../../models')
const { User, Tweet, Like } = db
// const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')

const adminController = {
  // Admin 取得所有使用者
  getUsers: (req, res) => {
    const options = {
      raw: true,
      attributes: {
        exclude: [
          'email',
          'password',
          'updatedAt',
          'createdAt'
        ]
      }
    }
    User.findAll(options)
      .then(users => {
        users.forEach(user => {
          if (user.introduction) {
            user.introduction = user.introduction.substring(0, 50)
          }
          console.log(user)
        })
        res.status(200).json(users)
      })
      .catch(error => {
        res.status(500).json({
          status: 'error',
          message: error
        })
      })
  },
  // Admin取得所有貼文
  getTweets: (req, res) => {
    const options = {
      raw: true,
      nest: true,
      attributes: ['id', 'description', 'replyCount', 'likeCount', 'createdAt'],
      include: [
        {
          model: User,
          attributes: ['id', 'account', 'name', 'avatar'],
          as: 'author'
        }
      ]
    }
    return Tweet.findAll(options)
      .then(tweets => {
        tweets.forEach(tweet => {
          tweet.description = tweet.description.substring(0, 50)
        })
        return res.status(200).json(tweets)
      })
      .catch(() =>
        res.status(500).json({
          status: 'error',
          message: 'errorrr'
        })
      )
  },
  // Admin刪除一篇貼文
  deleteTweet: (req, res) => {
    return Promise.all([
      Tweet.destroy({
        where: { id: req.params.id },
        raw: true,
        nest: true
      }),
      Like.destroy({
        where: { TweetId: req.params.id },
        raw: true,
        nest: true
      })
    ])
      .then(tweet => {
        if (!tweet) {
          throw new Error(
            '此貼文不存在，可能是 Parameters 的資料錯誤或已經被刪除'
          )
        }
        return res.status(200).json({
          status: 'success',
          message: 'Successfully delete tweet.'
        })
      })
      .catch(() =>
        res.status(500).json({
          status: 'error',
          message: 'error'
        })
      )
  },
  // Admin 登入
  signIn: async (req, res, next) => {
    try {
      const { account, password } = req.body
      if (!account || !password) throw new Error('Please enter account and password')

      const userData = await User.findOne({ where: { account } })

      if (!userData) throw new Error('User does not exist')
      if (userData.role === 'user') throw new Error('user permission denied')
      if (!bcrypt.compareSync(password, userData.password)) throw new Error('Incorrect password')

      const payload = {
        id: userData.id,
        account: userData.account,
        role: userData.role
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
