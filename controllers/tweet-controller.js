const { Tweet, User, Reply, Like } = require('../models')
const helpers = require('../_helpers')
const { getUser } = require('../_helpers')

const Sequelize = require('sequelize')

const tweetController = {

  getTweets: (req, res, next) => {
    Tweet.findAll({
      attributes: {
        include: [
          [Sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Replies WHERE Tweet.id = Replies.Tweet_id )'), 'replyCount'],
          [Sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Likes WHERE Tweet.id = Likes.Tweet_id )'), 'likeCount']
        ]
      },
      include: [
        { model: User, as: 'TweetUser', attributes: ['id', 'account', 'name', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        const likedTweetId = helpers.getUser(req)?.LikedTweets ? helpers.getUser(req).LikedTweets.map(t => t.id) : []
        const data = tweets.map(tweet => ({
          ...tweet,
          isLiked: likedTweetId.some(item => item === tweet.id)
        }))
        return res.status(200).json(data)
      })
      .catch(err => next(err))
  },

  getTweet: (req, res, next) => {
    Tweet.findByPk(req.params.tweet_id, {
      attributes: ['id', 'description', 'createdAt', 'updatedAt', 'replyCount', 'likeCount'],
      include: [
        Reply,
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
        { model: User, as: 'LikedUsers' }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(tweet => {
        if (!tweet) throw new Error('推文不存在！')

        return tweet.update({
          replyCount: tweet.Replies.length,
          likeCount: tweet.LikedUsers.length
        })
      })
      .then(tweet => {
        const likedTweetId = helpers.getUser(req)?.LikedTweets ? helpers.getUser(req).LikedTweets.map(t => t.id) : []
        const data = tweet.toJSON()
        data.isLiked = likedTweetId.some(item => item === tweet.id)
        delete data.Replies
        delete data.LikedUsers
        return res.status(200).json(data)
      })
      .catch(err => next(err))
  },

  // 尚未通過測試檔
  postTweet: (req, res, next) => {
    const UserId = Number(helpers.getUser(req).id)
    const { description } = req.body
    if (!description) throw new Error('推文內容不可空白！')
    if (description.trim().length > 140) throw new Error('推文字數不可超過140字！')

    return Tweet.create({
      UserId,
      description
    })
      .then(tweet => res.status(200).json(tweet))
      .catch(err => next(err))
  },

  getTweetReplies: (req, res, next) => {
    Reply.findAll({
      where: {
        tweetId: req.params.tweet_id
      },
      attributes: ['id', 'comment', 'createdAt', 'updatedAt'],
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(replies => res.status(200).json(replies))
      .catch(err => next(err))
  },

  // 尚未通過測試
  postTweetReply: (req, res, next) => {
    const UserId = Number(helpers.getUser(req).id)
    const TweetId = Number(req.params.tweet_id)
    const { comment } = req.body
    if (comment.length > 140) throw new Error('回覆字數不可超過140字！')
    if (!comment) throw new Error('回覆內容不可空白！')
    return Reply.create({
      TweetId,
      comment,
      UserId
    })
      .then(reply => res.status(200).json(reply))
      .catch(err => next(err))
  },

  addLike: (req, res, next) => {
    const TweetId = Number(req.params.id)
    const UserId = Number(helpers.getUser(req).id)
    Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: { UserId, TweetId }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error('推文不存在！')
        if (like) throw new Error('已對這篇推文按過Like！')

        return Like.create({
          UserId,
          TweetId
        })
      })
      .then(() => res.status(200).json({ message: '已成功Like這篇推文！' }))
      .catch(err => next(err))
  },

  addUnlike: (req, res, next) => {
    const TweetId = Number(req.params.id)
    const UserId = Number(helpers.getUser(req).id)

    Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: { TweetId, UserId }
      })
    ])

      .then(([tweet, like]) => {
        if (!tweet) throw new Error('推文不存在！')
        if (!like) throw new Error('沒有對這篇推文按過Like！')

        return like.destroy()
      })
      .then(() => res.status(200).json({ message: '已取消Like這篇推文！' }))
      .catch(err => next(err))
  }

}

module.exports = tweetController
