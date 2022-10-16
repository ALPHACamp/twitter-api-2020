const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: [
        User,
        { model: Like, include: User },
        { model: Reply, include: User },
        { model: User, as: 'LikedUsers' }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {

        const result = tweets
          .map(tweet => ({
            id: tweet.id,
            UserId: tweet.UserId,
            description: tweet.description,
            account: tweet.User.account,
            name: tweet.User.name,
            avatar: tweet.User.avatar,
            createdAt: tweet.createdAt,
            likeCount: tweet.Likes.length,
            commentCount: tweet.Replies.length,
            isLike: tweet.LikedUsers.map(t =>t.id).includes(req.user.id)
          }))

        return result
      })
      .then(data => res.status(200).json(data))
      .catch(err => next(err))
  },
  addTweet: (req, res, next) => {

    const { description } = req.body

    if (description.length === 0) {
      return res.status(403).json({
        status: 'error',
        message: '請輸入你想分享的內容'
      })
    }

    if (description.length > 140) {
      return res.status(403).json({
        status: 'error',
        message: '分享太多內容囉~~~ 上限140個字'
      })
    }

    Tweet.create({
      UserId: helpers.getUser(req).id,
      description
    })
      .then(data => res.status(200).json({
        status: 'success',
        message: '推文已成功新增',
        data
      }))
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    Tweet.findByPk(req.params.id,
      {
        include: [
          User,
          { model: Like, include: User },
          { model: Reply, include: User }
        ]
      })
      .then(tweet => {

        if (!tweet) throw new Error('此推文已消失在這世上')

        const isLike = tweet.Likes.some(l =>
          l.UserId === helpers.getUser(req).id
        )

        const result = ({
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          account: tweet.User.account,
          name: tweet.User.name,
          avatar: tweet.avatar,
          createdAt: tweet.createdAt,
          likeCount: tweet.Likes.length,
          commentCount: tweet.Replies.length,
          isLike
        })

        return result
      })
      .then(data => res.status(200).json(data))
      .catch(err => next(err))
  },
  getReplies: async (req, res, next) => {
    const tweetId = req.params.tweet_id
    Reply.findAll({
      include: [
        User,
        {model: Tweet, include: User}
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(replies => {
        const result = replies
          .map(reply => ({
            id: reply.id,
            UserId: reply.UserId,
            TweetId: reply.TweetId,
            comment: reply.comment,
            account: reply.User.account,
            name: reply.User.name,
            avatar: reply.User.avatar,
            TweetUserAccount: reply.Tweet.User.account,
            createdAt: reply.createdAt
          }))
          .filter(replyTweet =>
            replyTweet.TweetId === Number(tweetId))
        
        return result
      }
      )
      .then(data => res.status(200).json(data))
      .catch(err => next(err))
  },
  addReply: async (req, res, next) => {
    try {
      const { comment } = req.body
      const TweetId = req.params.tweet_id

      await Tweet.findByPk(TweetId)
        .then(tweet => {
          if (!tweet) {
            return res.status(403).json({
              status: 'error',
              message: '此推文已消失在這世上'
            })
          }
        })

      if (comment.length === 0) {
        return res.status(403).json({
          status: 'error',
          message: '請輸入你想留言的內容'
        })
      }

      await Reply.create({
        UserId: helpers.getUser(req).id,
        TweetId,
        comment
      })
        .then(data => res.status(200).json({
          status: 'success',
          message: '留言已成功新增',
          data
        }))
        .catch(err => next(err))

    } catch (err) { console.log(err) }

  },
  likeTweet: (req, res, next) => {
    const TweetId = req.params.id

    Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId
        },
        paranoid: false
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error('此推文已消失在這世上')

        if (like && !like.toJSON().deletedAt) throw new Error('已經喜歡這篇推文')

        if (like) {
          return like.restore()
        } else {
          return Like.create({
            UserId: helpers.getUser(req).id,
            TweetId
          })
        }

      })
      .then(data => res.status(200).json({
        status: 'success',
        message: '喜歡這篇推文',
        data
      }))
      .catch(err => next(err))

  },
  unlikeTweet: async (req, res, next) => {
    const TweetId = req.params.id

    Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error('此推文已消失在這世上')

        if (!like) throw new Error('你已經不喜歡這篇推文')

        return like.destroy()

      })
      .then(data => res.status(200).json({
        status: 'success',
        message: '不喜歡這篇推文',
        data
      }))
      .catch(err => next(err))
  }
}


module.exports = tweetController
