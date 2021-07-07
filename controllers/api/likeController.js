const db = require('../../models')
const Like = db.Like
const User = db.User

let defaultLimit = 10

let likeController = {
  getLikes: (req, res) => {
    const options = {
      limit: +req.query.limit || defaultLimit,
      offset: +req.query.offset || 0,
      where: {
        TweetId: req.params.tweetId,
      },
      attributes: [],
      include: [
        {
          model: User,
          attributes: ['id', 'account', 'name', 'avatar'],
          order: [['followerNum', 'DESC']],
        },
      ],
    }
    Like.findAll(options)
      .then((likes) => {
        likes = likes.map((like) => like.User)
        res.status(200).json({ Users: likes })
      })
      .catch(() => res.status(404).json({ status: 'error', messgae: '' }))
  },
}

module.exports = likeController
