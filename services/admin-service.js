const { User, Tweet, Reply, Like, Sequelize } = require('../models')

const adminServices = {
  getUsers: () => {
    return User.findAll({
      where: { role: 'user' },
      include: [{ model: Tweet }],
      attributes: [
        'id', 'email', 'account', 'name', 'avatar', 'cover', 'avatar', 'introduction', 'role', 'likedCount', 'repliedCount', 'followerCount', 'followingCount', 
        [Sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'tweetCount']
      ],
      order: [[Sequelize.literal('tweetCount'), 'DESC']]
    })
      .then(users => { return users })
  },
  deleteTweet: (tweetId) => {
    return Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) {
          throw new Error('Tweet does not exist')
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