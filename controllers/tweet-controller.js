const { Tweet, User, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          { model: User, attributes: ['name', 'avatar', 'account'] },
          Reply,
          Like,
          { model: User, as: 'LikedUsers' }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (tweets.length === 0) throw new Error('資料庫中未找到推文')
      const data = tweets.map(tweet => {
        return {
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          account: tweet.User.account,
          name: tweet.User.name,
          avatar: tweet.User.avatar,
          likedCount: tweet.Likes.length,
          repliedCount: tweet.Replies.length,
          isLiked: tweet.LikedUsers.map(t => t.id).includes(req.user.id)
        }
      })
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const id = req.params.tweet_id
      const tweet = await Tweet.findByPk(id,
        {
          include: [
            { model: User, attributes: ['name', 'avatar', 'account'] },
            Like,
            Reply,
            { model: User, as: 'LikedUsers' }]
        })
      if (!tweet) throw new Error('資料庫中未找到推文')
      const data = {
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        createdAt: tweet.createdAt,
        account: tweet.User.account,
        name: tweet.User.name,
        avatar: tweet.User.avatar,
        likedCount: tweet.Likes.length,
        repliedCount: tweet.Replies.length,
        isLike: tweet.LikedUsers.map(t => t.id).includes(req.user.id)
      }
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const { description } = req.body
      if (!description) throw new Error('請輸入內容')
      if (description && description.length > 140) throw new Error('內容字數超過140字元限制')
      const user = await User.findOne({
        where: { id: UserId },
        attributes: ['name', 'account', 'avatar']
      })
      const data = await Tweet.create({
        UserId,
        description
      })
      return res.status(200).json({ status: 'success', user, data })
    } catch (err) {
      next(err)
    }
  },
  putTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      const { description } = req.body
      if (!description) throw new Error('請輸入內容')
      if (!tweet) throw new Error('資料庫中未找到推文')
      if (description && description.length > 140) throw new Error('內容字數超過140字元限制')
      const data = await tweet.update({ description })
      return res.status(200).json({ status: 'success', data })
    } catch (error) {
      next(error)
    }
  },
  postLike: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const UserId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(
        TweetId,
        { include: User }
      )
      if (!tweet) throw new Error('資料庫中未找到推文')
      const likedTweetAuthor = tweet.dataValues.User.dataValues.account
      const isLiked = await Like.findOne({
        where: { UserId, TweetId }
      })
      if (isLiked) throw new Error('你已經按讚本篇推文')
      const createdLike = await Like.create({ UserId, TweetId })
      console.log(createdLike)
      return res.status(200).json({
        status: 'success',
        data: {
          id: createdLike.id,
          UserId: createdLike.UserId,
          TweetId: createdLike.TweetId,
          likedTweetAuthor
        }
      })
    } catch (err) {
      next(err)
    }
  },
  postUnlike: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const UserId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(
        TweetId, { include: User }
      )
      if (!tweet) throw new Error('資料庫中未找到推文')
      const unlikedTweetAuthor = tweet.dataValues.User.dataValues.account
      const isliked = await Like.findOne({
        where: { UserId, TweetId }
      })
      if (!isliked) throw new Error('你還沒按讚過本篇推文')
      const deletedLike = await isliked.destroy()
      return res.status(200).json({
        status: 'success',
        data: {
          id: deletedLike.id,
          Userid: deletedLike.UserId,
          Tweetid: deletedLike.TweetId,
          unlikedTweetAuthor
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getReply: async (req, res, next) => {
    try {
      const replies = await Reply.findAll({
        where: { tweetId: req.params.tweet_id },
        include: [
          { model: User, attributes: ['name', 'avatar', 'account'] },
          { model: Tweet, include: User }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (replies.length === 0) throw new Error('資料庫中未找到留言')
      const data = replies.map(reply => {
        return {
          id: reply.id,
          userId: reply.UserId,
          tweetId: reply.TweetId,
          tweetAuthorAccount: reply.Tweet.User.account,
          comment: reply.comment,
          createdAt: reply.createdAt,
          commentAccount: reply.User.account,
          name: reply.User.name,
          avatar: reply.User.avatar
        }
      })
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  postReply: async (req, res, next) => {
    try {
      const TweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(TweetId, { include: User })
      if (!tweet) throw new Error('資料庫中未找到推文')
      const repliedTweetAuthor = tweet.dataValues.User.dataValues.account
      const { comment } = req.body
      if (!comment) throw new Error('請輸入留言內容')
      if (comment && comment.length > 50) throw new Error('內容自數超過50字元限制')
      const createdReply = await Reply.create({
        UserId: helpers.getUser(req).id,
        TweetId,
        comment
      })
      return res.status(200).json({
        status: 'success',
        data: {
          id: createdReply.id,
          UserId: createdReply.UserId,
          TweetId: createdReply.TweetId,
          comment: createdReply.comment,
          repliedTweetAuthor
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
