const { Tweet, User, sequelize } = require('../models')

const adminController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      raw: true,
      nest: true
    })
      .then(tweets => {
        const data = tweets.map(t => ({
          ...t,
          description: t.description.substring(0, 50)
        }))
        return res.json({
          status: 'success',
          data: data
        })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
