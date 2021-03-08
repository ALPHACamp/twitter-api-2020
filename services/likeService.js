const db = require('../models')
const { Tweet, Like } = db
const helpers = require('../_helpers')

const likeService = {
  // 取得推文按讚數、相關資訊
  getLikes: (req, res, callback) => {
    const id = req.params.tweet_id

    return Tweet.findByPk(id, { include: [Like] })
      .then((tweet) => {
        const tweetData = {
          ...tweet.dataValues,
          likesCount: tweet.Likes.length
        }
        return callback(tweetData)
      })
      .catch((error) => callback({ status: 'error', message: 'Get Tweet Fail' }))
  },

  // 標記喜歡
  addLike: (req, res, callback) => {
    const id = req.params.tweet_id

    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: id
    })
      .then((like) => {
        return callback({ status: 'success', message: 'AddLike Success' })
      })
      .catch((error) => callback({ status: 'error', message: 'AddLike To Tweet Fail' }))
  },

  // 取消標記
  removeLike: (req, res, callback) => {
    const id = req.params.tweet_id

    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: id
      }
    })
      .then((like) => {
        if (!like) {
          return callback({ status: 'error', message: 'like was not exist' })
        }

        like.destroy()
          .then((result) => {
            return callback({ status: 'success', message: 'RemoveLike Success' })
          })
      })
      .catch((error) => callback({ status: 'error', message: 'RemoveLike To Tweet Fail' }))
  }
}

module.exports = likeService