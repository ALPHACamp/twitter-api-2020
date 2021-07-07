const db = require('../../models')
const Like = db.Like
const User = db.User
const Tweet = db.Tweet

let defaultLimit = 10
//temp user
let currentUserId = 1

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
      .catch(() => res.status(404).json({ status: 'error', messgae: '' }))
  },
  postLike: (req, res) => {
    Like.create({ UserId: currentUserId, TweetId: req.params.tweetId })
      .then((like) => {
        Promise.all([
          Tweet.findByPk(req.params.tweetId).then((tweet) =>
            tweet.increment({ likeNum: 1 })
          ),
          User.findByPk(currentUserId).then((user) =>
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
        res.status(400).json({
          status: 'error',
          message: ''
        })
      )
  },
  deleteLike: (req, res) => {
    Like.findOne({
      where: { TweetId: req.params.tweetId, UserId: currentUserId }
    })
      .then((Like) =>
        Like.destroy().then(() =>
          Promise.all([
            Tweet.findByPk(req.params.tweetId).then((tweet) =>
              tweet.decrement({ likeNum: 1 })
            ),
            User.findByPk(currentUserId).then((user) =>
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
        res.status(400).json({
          status: 'error',
          message: ''
        })
      )
  },
  getUserLikes: (req, res) => {
    Like.findAll({ where: { UserId: req.params.id } })
      .then(likes => res.status(200).json(likes))
      .catch(error => res.status(500).json(error))
  }
}

module.exports = likeController
