const db = require('../../models')
const Like = db.Like
const User = db.User
const Tweet = db.Tweet

let defaultLimit = 10
//temp user

let likeController = {
  getLikes: (req, res) => {
    const options = {
      limit: +req.query.limit || defaultLimit,
      offset: +req.query.offset || 0,
      where: {
        TweetId: req.params.tweetId
      },
      attributes: [],
      include: [
        {
          model: User,
          attributes: ['id', 'account', 'name', 'avatar'],
          order: [['followerNum', 'DESC']]
        }
      ]
    }
    Like.findAll(options)
      .then((likes) => {
        likes = likes.map((like) => like.User)
        res.status(200).json(likes)
      })
      .catch((error) => res.status(500).json({ status: 'error', message: error }))
  },
  postLike: (req, res) => {
    Like.create({ UserId: +req.user.id, TweetId: req.params.tweetId })
      .then((like) => {
        Promise.all([
          Tweet.findByPk(req.params.tweetId).then((tweet) =>
            tweet.increment({ likeNum: 1 })
          ),
          User.findByPk(+req.user.id).then((user) =>
            user.increment({ likeNum: 1 })
          )
        ])
          .then(() =>
            res
              .status(200)
              .json({ status: 'success', message: 'Successfully liked tweet.' })
          )
          .catch((error) =>
            res.json(500).json({ status: 'error', message: error })
          )
      })
      .catch((error) =>
        res.status(500).json({
          status: 'error',
          message: error
        })
      )
  },
  deleteLike: (req, res) => {
    Like.findOne({
      where: { TweetId: req.params.tweetId, UserId: +req.user.id }
    })
      .then((Like) =>
        Like.destroy().then(() =>
          Promise.all([
            Tweet.findByPk(req.params.tweetId).then((tweet) =>
              tweet.decrement({ likeNum: 1 })
            ),
            User.findByPk(+req.user.id).then((user) =>
              user.decrement({ likeNum: 1 })
            )
          ])
            .then(() =>
              res.status(200).json({
                status: 'success',
                message: 'Successfully unliked tweet.'
              })
            )
            .catch((error) =>
              res.json(500).json({ status: 'error', message: error })
            )
        )
      )
      .catch((error) =>
        res.status(500).json({
          status: 'error',
          message: error
        })
      )
  },
  getUserLikes: (req, res) => {
    const options = {
      limit: +req.query.limit || defaultLimit,
      offset: +req.query.offset || 0,
      attributes: ['id', 'UserId', 'TweetId'],
      where: { UserId: req.params.id },
      include: {
        model: Tweet,
        as: 'LikedTweet',
        attributes: ['id', 'description', 'likeNum', 'replyNum', 'createdAt']
      },
      order: [['createdAt', 'desc']]
    }
    Like.findAll(options)
      .then(likes => {
        likes = likes.map(like => {
          like.LikedTweet.dataValues.description = like.LikedTweet.dataValues.description.substring(0, 50)
          return like
        })
        return res.status(200).json(likes)
      })
      .catch(error => res.status(500).json(error))
  }
}

module.exports = likeController
