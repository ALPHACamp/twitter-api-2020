const { User, Tweet, Reply, Like } = require('../../models')
const { getUser } = require('../../_helpers')

const tweetController = {
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body

      // 使用者無法幫別人po文

      const tweet = await Tweet.create({
        UserId: res.locals.userId,
        description
      })
      return res.status(200).json(tweet)
    } catch (error) {
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          { model: User, as: 'TweetUser', attributes: ['id', 'name', 'account', 'avatar'] },
          {
            model: Reply,
            as: 'TweetReply',
            attributes: ['id'],
            include: [{ model: User, as: 'RepliedUser', attributes: ['name', 'account', 'avatar'] }]
          },
          { model: Like, as: 'TweetLike', attributes: ['id', 'UserId'] }
        ],
        nest: true,
        order: [['createdAt', 'DESC']]
      })

      // 錯誤處理
      if (!tweets) {
        const error = new Error('There is no tweet')
        error.status = 404
        throw error
      }
      const data = tweets.map(e => e.toJSON())

      const likes = await Like.findAll({ where: { UserId: getUser(req).id }, attributes: ['id', 'TweetId'] })
      const dic = {}
      for (let i = 0; i < likes.length; i++) {
        dic[likes[i].TweetId] = i
      }

      for (const i of data) {
        i.isLiked = false
        if (dic[i.id] >= 0) {
          i.isLiked = true
        }
      }

      return res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const { tweet_id } = req.params
      const tweet = await Tweet.findByPk(tweet_id, {
        include: [
          { model: User, as: 'TweetUser', attributes: ['id', 'name', 'account', 'avatar'] },
          {
            model: Reply,
            as: 'TweetReply',
            attributes: ['id', 'comment'],
            include: [{ model: User, as: 'RepliedUser', attributes: ['name', 'account', 'avatar'] }]
          },
          { model: Like, as: 'TweetLike', attributes: ['id', 'UserId'] }
        ]
      } // 這裡如果使用nest會有bug
      )
      const data = tweet.toJSON()

      // 錯誤處理
      if (!data) {
        const error = new Error('The tweet does not exist')
        error.status = 404
        throw error
      }
      data.isLiked = false
      for (const i of data.TweetLike) {
        if (i.UserId === getUser(req).id) {
          data.isLiked = true
          break
        }
      }

      return res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  },
  postReply: async (req, res, next) => {
    try {
      const { tweet_id } = req.params
      const { comment } = req.body
      const tweet = await Tweet.findByPk(tweet_id)

      // 錯誤處理
      if (!tweet) {
        const error = new Error('The tweet does not exist')
        error.status = 404
        throw error
      }

      const reply = await Reply.create({
        UserId: res.locals.userId,
        TweetId: tweet_id,
        comment
      })
      await tweet.increment('repliedCount', { by: 1 })

      return res.status(200).json(reply)
    } catch (error) {
      next(error)
    }
  },
  getReply: async (req, res, next) => {
    try {
      const { tweet_id } = req.params
      const tweet = await Tweet.findByPk(tweet_id, {
        include: [
          { model: User, as: 'TweetUser', attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Like, as: 'TweetLike', attributes: ['id', 'UserId'] },
          {
            model: Reply,
            as: 'TweetReply',
            attributes: ['id', 'UserId', 'comment', 'createdAt'],
            include: [{ model: User, as: 'RepliedUser', attributes: ['id', 'name', 'account', 'avatar'] }]
          }
        ]
      })

      // 錯誤處理
      if (!tweet) {
        const error = new Error('The tweet does not exist')
        error.status = 404
        throw error
      }

      const data = tweet.toJSON()

      // 先留著避免重寫

      // data.isLiked = false
      // for (const i of data.TweetLike) {
      //   if (i.UserId === getUser(req).id) {
      //     data.TweetReply.isLiked = true
      //   }
      // }
      return res.status(200).json(data.TweetReply)
    } catch (error) {
      next(error)
    }
  },
  likeTweet: async (req, res, next) => {
    try {
      const { id } = req.params
      const PromiseArr = await Promise.all(
        [
          Tweet.findByPk(id),
          Like.findOne({
            where: {
              UserId: res.locals.userId,
              TweetId: id
            }
          })
        ])

      // 錯誤處理
      if (!PromiseArr[0]) {
        const error = new Error('The tweet does not exist')
        error.status = 404
        throw error
      }
      if (PromiseArr[1]) {
        const error = new Error('The tweet does not exist')
        error.status = 409
        throw error
      }

      const like = await Like.create({
        UserId: res.locals.userId,
        TweetId: id
      })
      // likedCount + 1
      await PromiseArr[0].increment('likedCount', { by: 1 })

      return res.status(200).json(like)
    } catch (error) {
      next(error)
    }
  },
  unlikeTweet: async (req, res, next) => {
    try {
      const { id } = req.params
      const tweet = await Tweet.findByPk(id)

      // 錯誤處理
      if (!tweet) {
        const error = new Error('The tweet does not exist')
        error.status = 404
        throw error
      }
      const like = await Like.findOne({
        where: {
          UserId: res.locals.userId,
          TweetId: id
        }
      })

      // 錯誤處理
      if (!like) {
        const error = new Error('The like does not exist')
        error.status = 404
        throw error
      }
      await tweet.increment('likedCount', { by: -1 })
      await like.destroy()
      return res.status(200).json(like)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
