const { Tweet, User, Reply, Like } = require('../models')
const helpers = require('../_helpers')
const { newErrorGenerate } = require('../helpers/newError-helper')
const { relativeTimeFromNow, switchTime } = require('../helpers/dayFix-helper')
const { Sequelize } = require('sequelize')
const TWEETS_WORD_LIMIT = 140

const tweetController = {
  // 新增推文(tweet)
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      if (!description.trim()) newErrorGenerate('內容不可空白', 400)
      if (description.length > TWEETS_WORD_LIMIT) newErrorGenerate(`字數限制${TWEETS_WORD_LIMIT}字以內`, 400)
      const userId = helpers.getUser(req).id
      const newTweet = await Tweet.create({ description, UserId: userId })
      return res.json({ status: 'success', data: { newTweet } })
    } catch (err) {
      next(err)
    }
  },
  // 瀏覽所有推文
  getTweets: async (req, res, next) => {
    try {
      const selfUser = helpers.getUser(req).id
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        attributes: [
          'id',
          'description',
          'createdAt',
          'updatedAt',
          [Sequelize.literal('(SELECT COUNT(*) FROM `Replys` WHERE `Replys`.`TweetId` = `Tweet`.`id`)'), 'repliesCount'],
          [Sequelize.literal('(SELECT COUNT(*) FROM `Likes` WHERE `Likes`.`TweetId` = `Tweet`.`id`)'), 'likesCount']
        ],
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'avatar', 'account']
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!tweets) newErrorGenerate('推文不存在', 404)
      const selfUserLike = await Like.findAll({ raw: true, attributes: ['TweetId'], where: { UserId: selfUser } })
      const tweetsData = tweets.map(tweet => ({
        ...tweet,
        relativeTimeFromNow: relativeTimeFromNow(tweet.createdAt),
        isSelfUserLike: selfUserLike.some(s => s.TweetId === tweet.id)
      }))
      return res.json(tweetsData)
    } catch (err) {
      next(err)
    }
  },
  // 查看一篇推文
  getTweet: async (req, res, next) => {
    try {
      const id = req.params.tweet_id
      const selfUser = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(id, {
        raw: true,
        nest: true,
        attributes: [
          'id',
          'UserId',
          'description',
          'createdAt',
          'updatedAt',
          [Sequelize.literal('(SELECT COUNT(*) FROM `Replys` WHERE `Replys`.`TweetId` = `Tweet`.`id`)'), 'repliesCount'],
          [Sequelize.literal('(SELECT COUNT(*) FROM `Likes` WHERE `Likes`.`TweetId` = `Tweet`.`id`)'), 'likesCount']
        ],
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'avatar', 'account']
          }
        ]
      })
      if (!tweet) newErrorGenerate('推文不存在', 404)
      const selfUserLike = await Like.findAll({ raw: true, attributes: ['TweetId'], where: { UserId: selfUser } })
      const tweetData = {
        ...tweet,
        switchTime: switchTime(tweet.createdAt),
        relativeTimeFromNow: relativeTimeFromNow(tweet.createdAt),
        isSelfUserLike: selfUserLike.some(s => s.TweetId === tweet.id)
      }
      return res.json(tweetData)
    } catch (err) {
      next(err)
    }
  },
  // 新增回應（reply)
  postReply: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const userId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(tweetId, { raw: true, attributes: ['id'] })
      if (!tweet) newErrorGenerate('推文不存在', 404)
      const { comment } = req.body
      if (!comment.trim()) newErrorGenerate('內容不可空白', 400)
      if (comment.length > TWEETS_WORD_LIMIT) newErrorGenerate(`字數限制${TWEETS_WORD_LIMIT}字以內`, 400)
      const newReply = await Reply.create({ TweetId: tweetId, UserId: userId, comment })
      return res.json(newReply)
    } catch (err) {
      next(err)
    }
  },
  // 按讚推文
  addTweetLike: async (req, res, next) => {
    try {
      const tweetId = Number(req.params.tweet_id)
      const userId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(tweetId, { raw: true, attributes: ['id'] })
      if (!tweet) newErrorGenerate('推文不存在', 404)
      const like = await Like.findOne({ where: { tweetId, userId }, raw: true })
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
      const tweet = await Tweet.findByPk(tweetId, { raw: true, attributes: ['id'] })
      if (!tweet) newErrorGenerate('推文不存在', 404)
      const like = await Like.findOne({ where: { tweetId, userId } })
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
      const tweet = await Tweet.findByPk(id, {
        raw: true,
        nest: true,
        attributes: ['id'],
        include: [{ model: User, attributes: ['id', 'account'] }]
      })
      if (!tweet) newErrorGenerate('推文不存在', 404)
      const replies = await Reply.findAll({
        attributes: [
          'id',
          'comment',
          'createdAt',
          'updatedAt'
        ],
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        where: { TweetId: id },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!replies) newErrorGenerate('找不到回應訊息', 404)
      const repliesData = replies.map(reply => {
        reply.replyUser = reply.User
        reply.tweetUser = tweet.User
        reply.relativeTimeFromNow = relativeTimeFromNow(reply.createdAt)
        delete reply.User
        return reply
      })
      return res.json(repliesData)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetController
