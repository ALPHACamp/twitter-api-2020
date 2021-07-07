const { Like, Tweet, User } = require('../models')

const increaseLikeCounts = (tweetId) => {
  return new Promise((resolve, reject) => {
    // 找到指定 Tweet 並將 likeCounts 加一
    const tweet = Tweet.findByPk(tweetId)
      .then(tweet => {
        tweet.likeCounts += 1
        return Tweet.update({ likeCounts: tweet.likeCounts })
      })
      .then(() => resolve('likeCounts + 1'))
      .catch(err => reject(err))
  })
}

const decreaseLikeCounts = (tweetId) => {
  return new Promise((resolve, reject) => {
    // 找到指定 Tweet 並將 likeCounts 減一
    const tweet = Tweet.findByPk(tweetId)
      .then(tweet => {
        tweet.likeCounts -= 1
        return Tweet.update({ likeCounts: tweet.likeCounts })
      })
      .then(() => resolve('likeCounts - 1'))
      .catch(err => reject(err))
  })
}

const likeController = {
  addLike: async (req, res, next) => {
    try {
      const like = await Like.create({
        UserId: req.user.id,
        TweetId: req.params.id,
      })
      await increaseLikeCounts(req.params.id)
      return res.json({ status: 'success', message: '新增喜愛的貼文' })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const like = await Like.findByPk(req.params.id)
      await like.destroy()
      await decreaseLikeCounts(req.params.id)
      return res.json({ status: 'success', message: '已取消喜愛這則貼文' })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}