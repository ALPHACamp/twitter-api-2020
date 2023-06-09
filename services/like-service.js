const { Tweet, User, Reply, Like } = require('../models')
// POST /tweets/:id/like
const likeServices = {
  addLike: (req, cb) => {
    const tweetId = req.params.id
    return Promise.all([
      Tweet.findByPk(tweetId), 
      Like.findOne({
      where: {
        userId: req.user.id,
        tweetId
      }
    })
  ])
    .then(([tweet, like])=>{
      if (!tweet) throw new Error("Tweet didn't exist!")
      if (like) throw new Error('You have Liked this restaurant!')
      return Like.create({
        userId: req.user.id,
        tweetId
      })
    })
    .then(like => cb(null, {like})) //要不要加花括弧?
    .catch(err => cb(err))
  },
  // POST /tweets/:id/unlike
  unLike: (req, cb) => {
    return Like.findOne({
      where: {
        userId: req.user.id,
        tweetId: req.params.id
      }
    }).then(like => {
      if (!like) throw new Error("You haven't liked this tweet!")
      return like.destroy()
    }).then(reply => cb(null, { reply }))
      .catch(err => cb(err))
  }
}

module.exports = likeServices