const { Tweet, Like } = require('../models')
const { getUser } = require('./user-services')

const tweetController = {
  addLike: (req, cb) => {
    const userId = Number(getUser(req).id)
    const { tweetId } = req.params
    return Promise.all([
      Tweet.findByPk(tweetId),
      Like.findOne({
        where: {
          UserId: userId,
          TweetId: tweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        if (like) throw new Error('You have Like this Tweet')

        return Like.create({
          UserId: userId,
          TweetI: tweetId
        })
      })
      .then(addlike => cb(null, addlike))
      .catch(err => cb(err))
  }
}

module.exports = tweetController