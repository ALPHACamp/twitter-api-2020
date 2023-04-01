const { Like, Tweet, User, Reply } = require('../models')

const adminController = {
  // 取得 user 資料
  getUsers: (req, res, next) => {
    return User.findAll({
      attributes: ['id', 'email', 'name', 'account', 'image', 'avatar'],
      include: [
        { model: User, as: 'Followings', attributes: ['id'] },
        { model: User, as: 'Followers', attributes: ['id'] },
        { model: Tweet, include: { model: Like, attributes: ['id'] } }
      ]
    })
      .then(users => {
        const result = users
          .map(user => ({
            ...user.toJSON()
          }))
        result.forEach(r => {
          r.TweetsCount = r.Tweets.length
          r.FollowingsCount = r.Followings.length
          r.FollowersCount = r.Followers.length
          r.TweetsLikedCount = r.Tweets.reduce((acc, tweet) => acc + tweet.Likes.length, 0)
          delete r.Tweets
          delete r.Followings
          delete r.Followers
        })
        result.sort((a, b) => b.TweetsCount - a.TweetsCount)
        return res.status(200).json(result)
      })
      .catch(err => next(err))
  },
  // 顯示所有推文
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      order: [['createdAt', 'DESC'], ['UserId', 'ASC']],
      include: [{ model: User, attributes: ['account', 'name', 'avatar'] }],
      raw: true,
      nest: true
    })
      .then(tweets => {
        const result = tweets.map(tweet => ({
          ...tweet,
          description: tweet.description.slice(0, 50)
        }))
        return res.status(200).json({ success: true, result })
      })
      .catch(err => next(err))
  },
  // 刪除單一推文
  deleteTweet: (req, res, next) => {
    return Promise.all([
      Tweet.findByPk(req.params.id),
      Reply.destroy({ where: { TweetId: req.params.id } }),
      Like.destroy({ where: { TweetId: req.params.id } })
    ])
      .then(([tweet, reply, like]) => {
        if (!tweet) throw new Error('找不到這則推文')
        return tweet.destroy()
      })
      .then(removedTweet => res.status(200).json({ success: true, removedTweet }))
      .catch(err => next(err))
  }
}

module.exports = adminController
