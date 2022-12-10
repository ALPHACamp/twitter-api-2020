const { Tweet, User } = require('../models')
const adminController = {
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        const data = tweets.map(t => ({
          ...t,
          description: t.description.substring(0, 50)
        }))
        res.json(data)
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
