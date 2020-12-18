const helpers = require('../_helpers')

const db = require('../models')
const Tweet = db.Tweet

const tweetController = {
  readTweets: (req, res) => {},
  postTweet: (req, res) => {
    const { description } = req.body
    if (!description) {
      return res.status(400).json({ status: 'failure', message: "description didn't exist" })
    } else if (description.length > 140) {
      return res.status(409).json({ status: 'failure', message: 'number of the words must between 1 ~ 140' })
    } else {
      Tweet.create({
        description: description,
        UserId: helpers.getUser(req).id
      })
        .then(tweet => {
          return res.json({ status: 'success', message: 'tweet was successfully created', tweet })
        })
        .catch(err => next(err))
    }
  }
}

module.exports = tweetController
