const { User, Tweet } = require('../models')
const adminController = {
  getUsers: (req, res, next) => {
    User.findAll({
      include: [
        Tweet,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
      ],
      raw: true,
      nest: true,
    })
      .then((users) => {
        console.log(users)
        return res.status(200).json(users)
      })
      .catch((err) => next(err))
  },

  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: User,
      nest: true,
      raw: true
    })
      .then((tweets) => {
        if (!tweets) { return res.status(404).json({ message: 'No tweets found' }) }
        return res.status(200).json(tweets)
      })
      .catch((err) => next(err))
  },
}
module.exports = adminController