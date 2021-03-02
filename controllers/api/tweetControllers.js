const helpers = require('../../_helpers')
const db = require('../../models')
const { Tweet, User, Reply, Like } = db

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [User, Reply, Like]
    })
      .then(tweets => {
        const data = tweets.map(r => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50),
        }))
        return res.json(data)
      })
      .catch(error => console.log(error))
  },

  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [User, Reply, Like]
    })
      .then(tweet => {
        const data = tweet.toJSON()
        return res.json(data)
      })
      .catch(error => console.log(error))
  }

}

module.exports = tweetController