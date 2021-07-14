const db = require('../models')
const { Tweet, User, Like, Sequelize } = db

const tweetService = {
  getTweets: (viewerId, viewerRole = 'user') => {
    let attributesOption = []
    const descriptionLength = 50

    switch (viewerRole) {
      case 'user':
        attributesOption = [
          ['id', 'TweetId'], 'description', 'likeCount', 'replyCount', 'createdAt',
          [Sequelize.literal(`exists (select * from Likes where Likes.UserId = '${viewerId}' and Likes.TweetId = Tweet.id)`), 'isLike']
        ]
        break;

      case 'admin':
        attributesOption = [['id', 'TweetId'], [Sequelize.fn('LEFT', Sequelize.col('description'), descriptionLength), 'description'], 'createdAt']

        break;
    }


    return Tweet.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        },
        {
          model: Like,
          attributes: []
        }
      ],
      order: [['createdAt', 'DESC']],
      attributes: attributesOption,
      raw: true,
      nest: true
    }).then(tweets => {
      if (tweets[0].isLike) {
        tweets.forEach(tweet => {
          tweet.isLike = Boolean(tweet.isLike)
        })
      }

      return tweets
    })
  }
}

module.exports = tweetService