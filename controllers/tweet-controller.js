const { Tweet, User, Reply, Like } = require('../models')
const helpers = require('../_helpers')
const { newErrorGenerate } = require('../helpers/newError-helper')
const { relativeTimeFromNow } = require('../helpers/dayFix-helper')
const TWEETS_WORD_LIMIT = 140

const tweetController = {
  // 新增推文(tweet)
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      if (!description.trim()) newErrorGenerate('內容不可空白', 400)
      if (description.length > TWEETS_WORD_LIMIT) newErrorGenerate(`字數限制${TWEETS_WORD_LIMIT}字以內`, 400)
      const userId = helpers.getUser(req).id
      const user = await User.findByPk(userId, { raw: true })
      if (!user) newErrorGenerate('使用者不存在', 404)
      const newTweet = await Tweet.create({ description, UserId: userId })
      return res.json({ status: 'success', data: { newTweet } })
    } catch (err) {
      next(err)
    }
  },
  // 瀏覽所有推文
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          { model: User, attributes: ['id', 'name', 'avatar', 'account'] },
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['id'] }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!tweets) newErrorGenerate('推文不存在', 404)
      const tweetsData = tweets?.map(tweet => {
        tweet = tweet.toJSON()
        const { Replies, Likes, ...Data } = tweet
        return {
          ...Data,
          relativeTimeFromNow: relativeTimeFromNow(tweet.createdAt),
          repliesCount: tweet.Replies?.length,
          likesCount: tweet.Likes?.length
        }
      })
      return res.json(tweetsData)
    } catch (err) {
      next(err)
    }
  },
  // 查看一篇推文
  getTweet: async (req, res, next) => {
    try {
      const id = req.params.tweet_id
      const data = await Tweet.findByPk(id, {
        include: [
          { model: User, attributes: ['id', 'name', 'avatar', 'account'] },
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['id'] }
        ]
      })
      if (!data) newErrorGenerate('推文不存在', 404)
      const tweetData = data?.toJSON()
      const tweet = {
        ...tweetData,
        relativeTimeFromNow: relativeTimeFromNow(tweetData.createdAt),
        repliesCount: tweetData.Replies?.length,
        likesCount: tweetData.Likes?.length
      }
      delete tweet.Replies
      delete tweet.Likes
      return res.json(tweet)
    } catch (err) {
      next(err)
    }
  },
  // 按讚推文
  addTweetLike: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const userId = helpers.getUser(req).id
      const [tweet, user, like] = await Promise.all([
        Tweet.findByPk(tweetId, { raw: true, attributes: ['id'] }),
        User.findByPk(userId, { raw: true, attributes: ['id'] }),
        Like.findOne({ where: { tweetId, userId }, raw: true })
      ])
      if (!tweet) newErrorGenerate('推文不存在', 404)
      if (!user) newErrorGenerate('使用者不存在', 404)
      if (like) newErrorGenerate('已按過喜歡', 400)
      const addLike = await Like.create({ TweetId: tweetId, UserId: userId })
      return res.json(addLike)
    } catch (err) {
      next(err)
    }
  },
  // 取消按讚推文
  removeTweetLike: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const userId = helpers.getUser(req).id
      const [tweet, user, like] = await Promise.all([
        Tweet.findByPk(tweetId, { raw: true, attributes: ['id'] }),
        User.findByPk(userId, { raw: true, attributes: ['id'] }),
        Like.findOne({ where: { tweetId, userId } })
      ])
      if (!tweet) newErrorGenerate('推文不存在', 404)
      if (!user) newErrorGenerate('使用者不存在', 404)
      if (!like) newErrorGenerate('未按過喜歡', 400)
      const removeLike = await like.destroy()
      return res.json(removeLike)
    } catch (err) {
      next(err)
    }
  },
  // 瀏覽推文的所有回應
  tweetReplies: async (req, res, next) => {
    try {
      const id = req.params.tweet_id
      const tweet = await Tweet.findByPk(id, { raw: true })
      if (!tweet) newErrorGenerate('推文不存在', 404)

      let replies = await Reply.findAll({
        attributes: ['id', 'comment', 'createdAt', 'updatedAt'],
        where: { TweetId: id },
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })

      if (!replies) newErrorGenerate('找不到回應訊息', 404)

      replies = replies.map(reply => ({
        ...reply,
        relativeTimeFromNow: relativeTimeFromNow(reply.createdAt)
      }))

      return res.json(replies)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetController
