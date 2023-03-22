const { Tweet, User } = require('../models')
const user = require('../models/user')
const adminController = {
  // 登入
  signIn: async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required' })
    }
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) return res.status(404).json({ status: 'error', message: 'User does not exist' })
      if (user.role === 'user') return res.status(404).json({ status: 'error', message: 'User does not exist' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'Incorrect password' })
      }
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success',
        message: 'Successfully sign in',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  }, // 推文清單(每筆資料顯示推文內容的前50字)
  getTweet: async (req, res, next) => {
    return Tweet.findAll({
      raw: true
    }).then(tweets => {
      const data = tweets.map(t => ({
        ...t,
        description: t.description.substring(0, 50)
      }))
      return res.status(200).json(data)
    })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) { return res.status(400).json({ status: 'error', message: "Tweet didn't exist!" }) }
        return tweet.destroy()
      })
      .then(() => {
        return res.json({
          status: 'success',
          message: 'Successfully deleted the tweet'
        })
      })
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true
      // include: [
      //   { model: Tweet, as: 'TweetLikes' },
      //   { model: User, as: 'Usertweets' },
      //   { model: User, as: 'Followers' },
      //   { model: User, as: 'Followings' }
      // ]
    })
      .then(users => {
        // const data = users.map(u => ({
        //   ...u,
        //   followersCount: User.Followers.length, // 跟隨者人數
        //   followingsCount: User.Followings.length, // 關注人數
        //   tweetsCount: User.Usertweets.length, // 使用者的 Tweet 累積總量
        //   tweetLikesCount: Tweet.TweetLikes.length // 推文被 like 的數量
        // }))
        return res.status(200).json(users)
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
