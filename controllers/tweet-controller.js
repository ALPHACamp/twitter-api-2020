const tweetServices = require('../services/tweet-services')
const { relativeTimeFromNow } = require('../helpers/dayjs-helpers')
const { Tweet, Like } = require('../models')
const helpers = require('../_helpers')
const tweetController = {
  getTweets: async(req, res, next) => {
    tweetServices.getTweets(req, (err, data) => err ? next(err) : res.json(data))
  },
  getTweet: async(req, res, next) => {
    tweetServices.getTweet(req, (err, data) => err ? next(err) : res.json(data))
  },
  postTweets: async (req, res, next) => {
    try {
      const { description } = req.body
      const UserId = helpers.getUser(req).id

      if (!description) {
        throw new Error('Tweet不能為空!')
      }

      if (description.length > 140) {
        throw new Error('輸入不得超過140字!')
      }

      const tweet = await Tweet.create({
        description,
        UserId,
      })
      const tweetData = tweet.toJSON()
        tweetData.createdAt = relativeTimeFromNow(tweetData)
      res.status(200).json(tweetData)
    } catch (err) {
          next(err)
    }
  },
  addLike: async(req, res, next) => {
    try{
      const { id } = req.params
      const tweet = await Tweet.findByPk(id)
      const like = await Like.findOne({
              where: {
                UserId: helpers.getUser(req).id,
                TweetId: id
              }
            })
      if (!tweet) throw new Error("Tweet不存在!")
      if (like) throw new Error('你已經like過這篇Tweet了')

      const likeCreate = await Like.create({
        UserId: helpers.getUser(req).id,
        TweetId: Number(id)
      })
      res.status(200).json(likeCreate)
    } catch (err) {
          next(err)
    }
  },
  removeLike: async (req, res, next) => {
  try {
    const { id } = req.params
    const like = await Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        tweetId: id
      }
    })

    if (!like) {
      throw new Error('這篇Tweet沒被like')
    }

    await like.destroy()
    res.status(200).json({ message: 'Like 取消成功' })
  } catch (err) {
    next(err)
  }
}
}
module.exports = tweetController