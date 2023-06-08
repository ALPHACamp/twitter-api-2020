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
        include: [{
          model: User, attributes: ['account', 'name', 'avatar']
        }]
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
    const { description, likable, commendable } = req.body
    if (!description) throw new Error('Description can not be empty!')
    if (description.length > 140) throw new Error('Max length 140.')
    const id = req.user.id
    Tweet.create({
      UserId: id,
      description,
      likable: likable || '1',
      commendable: commendable || '1'
    })
      .then(data => {
        if (!data) throw new Error('Tweet not found!')
        res.json({ status: 'success', data })
      })
      .catch(err => next(err))
  },
  putTweet: (req, res, next) => {
    const { description, likable, commendable } = req.body
    const id = req.params.id
    if (!description) throw new Error('Description can not be empty!')
    if (description.length > 140) throw new Error('Max length 140.')
    Tweet.findByPk(id)
      .then(tweet => {
        if (!tweet) throw new Error('Tweet not found!')
        return tweet.update({
          description,
          likable: likable || '1',
          commendable: commendable || '1'
        })
      })
      .then(data => {
        console.log(data)
        if (!data) throw new Error('Update failed!')
        res.json({ status: 'success', data })
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    const id = req.params.id
    Tweet.findByPk(id)
      .then(tweet => {
        if (!tweet) throw new Error('Tweet not found')
        tweet.destroy()
      })
      .then(() => {
        res.json({ status: 'success', message: 'Delete success' })
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
