const db = require('../models')
const { Tweet, Reply, User, Like, Followship, Sequelize } = db
const { Op } = Sequelize
const RequestError = require('../libs/RequestError')

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
  },

  postTweet: (viewerId, description = null) => {
    if (!description) {
      throw new RequestError('Description can not be null')
    } else if (description.length > 140) {
      throw new RequestError('Description can not be longer than 140')
    } else {
      return Tweet.create({
        UserId: viewerId,
        description,
        replyCount: 0,
        likeCount: 0
      }).then(tweet => {
        return {
          id: tweet.id,
          status: 'success',
          message: 'Create tweet successfully'
        }
      })
    }
  },

  postReply: (viewerId, TweetId, comment) => {
    if (!comment) {
      throw new RequestError('Comment can not be null')
    }

    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) {
          throw new RequestError('Tweet does not exist')
        }
        return Promise.all([
          Reply.create({ UserId: viewerId, TweetId, comment }),
          tweet.increment('replyCount')
        ]).then(result => {
          return {
            id: result[0].id,
            status: 'success',
            message: 'Reply has been created successfully'
          }
        })
      })
  },
  }
}

module.exports = tweetService