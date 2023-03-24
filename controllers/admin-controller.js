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
      .then(users => res.json({ status: 'success', users }))
      .catch(err => next(err))
  },
  // 顯示所有推文
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      order: [['createdAt', 'DESC'], ['UserId', 'ASC']],
      raw: true
      //! 等下再想能不能直接從資料庫 slice(0, 50)
    })
      .then(tweets => {
        const result = tweets.map(tweet => ({
          ...tweet,
          description: tweet.description.slice(0, 50)
        }))
        return res.status(200).json(result)
      })
      .catch(err => next(err))
  },
  // 刪除單一推文
  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        // if (!tweet) return res.status(404).json({ message: 'Can not find this tweet.' })
        //! 功能能用 但 console 跳錯，檢查
        return tweet.destroy()
      })
      .then(removedTweet => res.status(200).json(removedTweet))
      // .catch(err => next(err))
  }
}

module.exports = adminController
