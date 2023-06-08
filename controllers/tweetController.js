const { User, Tweet } = require('../models')
const tweetController = {
  getTweets: (req, res, next) => {
    // ?sort=DESC
    // console.log(sortQuery)
    const userId = req.params.id
    Tweet.findAll({
      where: { UserId: userId },
      include: [
        { model: User, attributes: ['account', 'name', 'avatar'] }
      ],
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC']
      ]
    })
      .then(data => {
        res.json({ status: 'success', data })
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const id = req.params.id
    Tweet.findByPk(
      id, {
        include: [{ model: User, attributes: ['account', 'name', 'avatar'] }]
      })
      .then(data => {
        if (!data) throw new Error('Can not find this tweet!')
        res.json({ status: 'success', data })
      })
      .catch(err => next(err))
  },
  getRepliedTweets: (req, res, next) => {

  },
  postTweet: (req, res, next) => {

  },
  putTweet: (req, res, next) => {

  },
  deleteTweet: (req, res, next) => {

  }

}

module.exports = tweetController
