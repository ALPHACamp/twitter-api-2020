const { Tweet, Like } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  addLike: (req, cb) => {
    return Promise.all([
      Tweet.findByPk(req.params.id),
      Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: req.params.id
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        if (like) throw new Error('You have Like this Tweet')

        return Like.create({
          UserId: helpers.getUser(req).id,
          TweetId: req.params.id
        })
      })
      .then(addlike => cb(null, addlike))
      .catch(err => cb(err))
  },
  removeLike: (req, cb) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    })
      .then(removelike => {
        if (!removelike) throw new Error("You haven't like this tweet")

        return removelike.destroy()
      })
      .then(removelike => cb(null, removelike))
      .catch(err => cb(err))
  }
}

module.exports = tweetController