const db = require('../../models')
const Tweet = db.Tweet
const Like = db.Like
const User = db.User
const defaultLimit = 10
//temp user ==> userId = 1
let currentUserId = 1

let tweetController = {
  getTweets: (req, res) => {
    const options = {
      limit: +req.query.limit || defaultLimit,
      offset: +req.query.offset || 0,
      attributes: ['id', 'description', 'likeNum', 'replyNum', 'createdAt'],
      order: [['createdAt', 'desc']],
      subQuery: false,
      include: [
        {
          model: User,
          attributes: ['id', 'account', 'name', 'avatar'],
          as: 'User',
        },
        {
          model: User,
          as: 'LikedUsers',
          attributes: ['id'],
          through: {
            attributes: [],
          },
        },
      ],
    }
    Tweet.findAll(options)
      .then((tweets) => {
        tweets = tweets.map((tweet) => {
          const {
            id,
            description,
            likeNum,
            replyNum,
            createdAt,
            updatedAt,
            deletedAt,
            AdminId,
            User,
          } = tweet
          return {
            id,
            isLike: tweet.LikedUsers.some((user) => user.id === currentUserId),
            description: description.substring(0, 50),
            likeNum,
            replyNum,
            createdAt,
            updatedAt,
            deletedAt,
            AdminId,
            User,
          }
        })
        return res.status(200).json(tweets)
      })
      .catch(() => res.status(404).json({ status: 'error', message: '' }))
  },
  getTweet: (req, res) => {
    const options = {
      attributes: [
        'id',
        'description',
        'likeNum',
        'replyNum',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'AdminId',
      ],
      include: [
        {
          model: User,
          as: 'LikedUsers',
          attributes: ['id'],
          through: {
            attributes: [],
          },
        },
      ],
    }
    Tweet.findByPk(req.params.tweetId, options)
      .then((tweet) => {
        tweet = tweet.toJSON()
        const {
          id,
          description,
          likeNum,
          replyNum,
          createdAt,
          updatedAt,
          deletedAt,
          AdminId,
          User,
        } = tweet
        res.status(200).json({
          id,
          isLike: tweet.LikedUsers.some((user) => user.id === currentUserId),
          description,
          likeNum,
          replyNum,
          createdAt,
          updatedAt,
          deletedAt,
          AdminId,
          User,
        })
      })
      .catch(() => res.status(404).json({ status: 'error', message: '' }))
  },
  postTweet: (req, res) => {
    if (!req.body.description) {
      return res
        .status(400)
        .json({ status: 'error', messgae: 'Can not post empty description' })
    }
    if (req.body.description.length > 140) {
      return res
        .status(400)
        .json({ status: 'error', messgae: 'Can not post over 140 characters' })
    }
    const data = {
      UserId: currentUserId,
      description: req.body.description,
      likeNum: 0,
      replyNum: 0,
    }
    Tweet.create(data)
      .then((tweet) => {
        User.findByPk(currentUserId)
          .then((user) => user.increment({ tweetNum: 1 }))
          .then(() =>
            res.status(200).json({
              status: '200',
              message: 'Successfully posted new tweet.',
            })
          )
      })
      .catch((error) =>
        res.status(400).json({
          status: 'error',
          message: '',
        })
      )
  },
}

module.exports = tweetController
