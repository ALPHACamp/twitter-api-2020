const { Like, Tweet, User } = require('../models')

const adminController = {
  getUsers: (req, res, next) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Like },
        { model: Tweet }
      ]
    })
      .then(users => {
        res.json({ status: 'success', users })
      })
      .catch(err => next(err))
  },
  // 顯示所有推文
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      order: [['createdAt', 'DESC'], ['UserId', 'ASC']],
      attributes: ['UserId', 'description', 'createdAt'],
      raw: true
      //! 等下再想能不能直接從資料庫 slice(0, 50)
    })
      .then(tweets => {
        const result = tweets.map(tweet => ({ ...tweet, description: tweet.description.slice(0, 50) }))
        return res.status(200).json(result)
      })
  }
}

module.exports = adminController
