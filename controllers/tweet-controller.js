const { User, Tweet, Like, Reply, Followship } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: [
        User,
        { model: Like, include: User },
        { model: Reply, include: User }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {

        const result = tweets
          .map(tweet => ({
            ...tweet.toJSON(),
            likeCount: tweet.Likes.length,
            commentCount: tweet.Replies.length
          }))
          .map(tweet => {

            if (tweet.Replies.length) {
              tweet.Replies.map(
                reply => delete reply.User.password
              )
            }

            if (tweet.Likes.length) {
              tweet.Likes.map(
                like => delete like.User.password
              )
            }

            if (tweet.User) delete tweet.User.password

            return tweet
          })

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
          ...tweet.toJSON(),
          likeCount: tweet.Likes.length,
          commentCount: tweet.Replies.length,
          isLike
        })

        if (result.Replies.length) {
          result.Replies.map(
            reply => delete reply.User.password
          )
        }

        if (result.Likes.length) {
          console.log(result.Likes)
          result.Likes.map(
            like => delete like.User.password
          )
        }

        if (result.User) delete result.User.password

        return result
      })
      .then(data => res.status(200).json(data))
      .catch(err => next(err))
  },
  getReplies: async (req, res, next) => {
    const tweetId = req.params.tweet_id
    Reply.findAll({
      include: User,
      order: [['createdAt', 'DESC']]
    })
      .then(replies => {
        const result = replies
          .map(reply => ({
            ...reply.toJSON()
          }))
          .filter(replyTweet =>
            replyTweet.TweetId === Number(tweetId))
        
        if (result) {
          result.map(
            reply => delete reply.User.password
          )
        }
        return result
      }
      )
      .then(data => res.status(200).json(data))
      .catch(err => next(err))
  },
  addReply: async (req, res, next) => {
    try {
      const { comment } = req.body
      const tweetId = req.params.tweet_id

      await Tweet.findByPk(tweetId)
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
        userId: helpers.getUser(req).id,
        tweetId,
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
  },
  addFollow: (req, res, next) => {
    const { id } = req.body

    Promise.all([
      User.findByPk(id),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: id
        }
      })
    ])
      .then(([user, followship]) => {

        if (!user) throw new Error('使用者不存在')

        if (helpers.getUser(req).id === Number(id)) throw new Error('你無法追蹤自己')

        if (followship) throw new Error('你已經追蹤此使用者')


        return Followship.create({
          followerId: helpers.getUser(req).id,
          followingId: id
        })

      })
      .then(data => res.status(200).json({
        status: 'success',
        message: '追蹤中',
        data
      }))
      .catch(err => next(err))
  },
  removeFollow: (req, res, next) => {
    const { followingId } = req.params

    Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: followingId
        }
      })
    ])
      .then(([user, followship]) => {

        if (!user) throw new Error('使用者不存在')

        if (!followship) throw new Error('你未追蹤此使用者')

        return followship.destroy()

      })
      .then(data => res.status(200).json({
        status: 'success',
        message: '取消追蹤',
        data
      }))
      .catch(err => next(err))
  }
}


module.exports = tweetController
