const { User, Tweet, Reply, Like } = require('../models')

const adminServices = {
  getUsers: () => {
    return User.findAll({
      where: { role: 'user' }
    })
      .then(users => { return users })
  },
  deleteTweet: (tweetId) => {
    return Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) {
          throw new RequestError('Tweet does not exist')
        }

        return Promise.all([
          tweet.destroy(),
          Reply.destroy({
            where: { TweetId: tweetId }
          }),
          Like.destroy({
            where: { TweetId: tweetId }
          })
        ]).then(deletedTweet => {
          return {
            deletedTweet,
            status: 'success',
            message: `Tweet.id: ${tweetId} and associate replies and likes have been destroyed successfully.`
          }
        })
      })
  }
}

module.exports = adminServices