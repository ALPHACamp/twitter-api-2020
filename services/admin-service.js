const { User, Tweet, Reply, Like, Sequelize } = require('../models')

const adminServices = {
  getUsers: () => {
    return User.findAll({
      where: { role: 'user' },
      include: [{ model: Tweet }],
      attributes: [
        'id', 'email', 'account', 'name', 'avatar', 'cover', 'avatar', 'introduction', 'role', 'repliedCount', 'followerCount', 'followingCount',
        [Sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'tweetCount'],
        [
          Sequelize.literal('(SELECT COUNT(*) FROM Tweets INNER JOIN Likes ON Tweets.id = Likes.TweetId WHERE Tweets.UserId = User.id)'),
          'likedCount',
        ],
      ],
      order: [[Sequelize.literal('tweetCount'), 'DESC']]
    })
      .then(users => { return users })
  },
  getTweets: async () => {
    const rawTweets = await Tweet.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        }
      ],
      attributes: ['id', 'description', 'createdAt'],
      order: [['createdAt', 'DESC']]
    })

    const tweets = rawTweets.map(r => ({
      id: r.id,
      description: r.description.substring(0, 50),
      createdAt: r.createdAt,
      User: r.User
    }))

    return {
      tweets,
      status: 'success',
      message: 'Get all tweets successfully'
    }
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