const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like

const adminController = {
  readUsers: (req, res, next) => {
    User.findAll({
      where: { role: 'user' },
      include: [
        Tweet,
        Like,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ]
    }).then(users => {
      users = users.map(user => ({
        ...(Object.fromEntries(Object.entries(user.dataValues).slice(0, 11))),
        tweetsCount: user.Tweets.length,
        likesCount: user.Likes.length,
        followersCount: user.Followers.length,
        followingsCount: user.Followings.length
      }))
      users = users.sort((a, b) => b.tweetsCount - a.tweetsCount)
      return res.json(users)
    }).catch(next)
  },

  readTweets: (req, res, next) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        attributes: ['id', 'account', 'name', 'avatar']
      }]
    }).then(tweets => res.json(tweets))
      .catch(next)
  },

  deleteTweet: (req, res, next) => {
    const id = Number(req.params.id)
    Tweet.findByPk(id).then(tweet => {
      if (!tweet) {
        return res.status(400).json({ message: `tweets/${id} do not exit!` })
      }

      return tweet.destroy().then(tweet => res.json({
        message: `tweets/${tweet.id} is deleted successfully`,
        tweet
      }))
    }).catch(next)
  }
}

module.exports = adminController
