const { User, Tweet } = require('../models')

const adminController = {
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: [User]
    })
      .then(tweets => {
        console.log(tweets)
        res.send('hi')
        // res.status(200).json({ status: 'success', data: tweets })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
