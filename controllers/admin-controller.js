const { User, Tweet, Like } = require('../models')

const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const data = await User.findAll({
        attributes: ['id', 'name', 'account', 'avatar', 'cover'],
        include: [
          {
            model: Tweet,
            attributes: ['id'],
            include: [{ model: Like, attributes: ['id'] }]
          },
          { model: User, as: 'Followings', attributes: ['id'] },
          { model: User, as: 'Followers', attributes: ['id'] }
        ]
      })
      const users = data.map(d => {
        const user = {
          ...d.toJSON(),
          tweets: d.Tweets?.length || 0,
          likes: (d.Tweets?.map(t => t.Likes.length)).reduce((a, b) => a + b, 0),
          followings: d.Followings?.length || 0,
          followers: d.Followers?.length || 0
        }
        delete user.Tweets
        delete user.Followers
        delete user.Followings
        return user
      })
      users.sort((a, b) => b.tweets - a.tweets)
      res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  },
  removeTweet: async (req, res, next) => {
    try {
      const { id } = req.params
      const tweet = await Tweet.findByPk(id)
      if (!tweet) throw new Error('推文不存在')
      await tweet.destroy()
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
