const { User, Tweet } = require('../models')
// const { getUser } = require('../_helpers')

const adminController = {
  getTweets: (req, res, next) => {
    // if (!getUser(req)) {
    //   return res.status(401).json({ status: 'error', message: 'token is invalidated' })
    // } else if (!req.user) // error 5XX 這邊應該怎麼判斷伺服器錯誤呀？
    // {
    //   return res.status(500).json({ status: 'error', message: 'internal server error' })
    // }
    Tweet.findAll({
      nest: true,
      raw: true,
      include: {
        model: User,
        attributes: ['id', 'account', 'name', 'avatar']
      }
    })
      .then(tweets => {
        const data = tweets.map(t => ({
          ...t,
          description: t.description.substring(0, 50)
        }))
        return res.status(200).json({ status: 'success', data })
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    // if (!getUser(req)) {
    //   return res.status(401).json({ status: 'error', message: 'token is invalidated' })
    // } else if (!req.user) // error 5XX 這邊應該怎麼判斷伺服器錯誤呀？
    // {
    //   return res.status(500).json({ status: 'error', message: 'internal server error' })
    // }
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          return res.status(400).json(
            { status: 'error', message: 'Tweet did not exist!' }
          )
        }
        res.status(200).json({ status: 'success', data: tweet })
        return tweet.destroy()
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
