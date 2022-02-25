const { Tweet, User, Reply, Like } = require('../models')
const helpers = require('../_helpers')


module.exports = {
  getTweets: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id 

      const tweets = await Tweet.findAll({
        include: [
          { model: User },
          { model: User, as: 'UsersFromLikedTweets' }
        ],
        order: [['createdAt', 'DESC']],
        nest: true
      })

      if (!tweets.length) throw new Error('沒有任何推文!')

      // reassemble tweets array
      const responseData = tweets.map(tweet => {
        tweet = tweet.toJSON()

        // assign following two objects to temp constants
        const tweetedUser = tweet.User
        const usersFromLikedTweets = tweet.UsersFromLikedTweets

        // delete original properties from tweet
        delete tweet.User
        delete tweet.UsersFromLikedTweets
        delete tweetedUser.password

        return {
          ...tweet,
          isLiked: usersFromLikedTweets.some(u => u.id === UserId),
          tweetedUser
        }
      })

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  },

  getTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = Number(req.params.TweetId)

      let tweet = await Tweet.findByPk(TweetId, {
        include: [
          { model: User },
          { model: User, as: 'UsersFromLikedTweets' }
        ],
        nest: true
      })

      if (!tweet) throw new Error('沒有這則推文!')

      tweet = tweet.toJSON()

      // assign following two objects to temp constants
      const tweetedUser = tweet.User
      const usersFromLikedTweets = tweet.UsersFromLikedTweets

      // remove unnecessary key properties
      delete tweet.User
      delete tweet.UsersFromLikedTweets
      delete tweetedUser.password

      // reassemble tweet object
      const responseData = {
        ...tweet,
        isLiked: usersFromLikedTweets.some(u => u.id === UserId),
        tweetedUser
      }

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  },

  postTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const description = req.body.description?.trim() || null

      if (!description) throw new Error('推文不能為空!')
      if (description.length > 140) throw new Error('推文字數不能超過140字!')

      // find user and create tweet at the same time
      const [user, tweet] = await Promise.all([
        User.findByPk(UserId),
        Tweet.create({ description, UserId })
      ])

      if (!user) throw new Error('這位使用者不存在，發佈推文動作失敗!')

      // plus totalTweets number by 1,
      // and then get full tweet data from database
      const [_, responseData] = await Promise.all([
        user.increment('totalTweets', { by: 1 }),
        Tweet.findByPk(tweet.id, { raw: true })
      ])

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  },

  getReplies: async (req, res, next) => {
    try {
      const TweetId = Number(req.params.TweetId)

      const [tweet, replies] = await Promise.all([
        Tweet.findByPk(TweetId),
        Reply.findAll({
          include: User,
          where: { TweetId },
          nest: true
        })
      ])

      if (!tweet) throw new Error('因為沒有這則推文，無法查詢底下的回覆!')
      if (!replies.length) throw new Error('這則推文沒有任何回覆!')

      // reassemble replies array
      const responseData = replies.map(reply => {
        reply = reply.toJSON()

        // assign following object to temp constant
        const repliedUser = reply.User

        // remove unnecessary key properties
        delete reply.User
        delete repliedUser.password

        return { ...reply, repliedUser }
      })

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  },

  postReply: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = Number(req.params.TweetId)
      const comment = req.body.comment?.trim() || null

      if (!comment) throw new Error('回覆不能為空!')
      if (comment.length > 140) throw new Error('回覆字數不能超過140字!')

      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error('因為沒有這則推文，無法在其底下新增回覆!')

      // plus both totalReplies number by 1, and
      // create reply, and then return full reply data from database
      const [_, responseData] = await Promise.all([
        tweet.increment('totalReplies', { by: 1 }),
        Reply.create({
          comment, TweetId, UserId
        })
      ])

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  },

  postLike: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = Number(req.params.TweetId)

      const [tweet, like] = await Promise.all([
        Tweet.findOne({
          include: User,
          where: { id: TweetId }
        }),
        Like.findOne({
          where: { UserId, TweetId }
        })
      ])

      if (!tweet) throw new Error('因為沒有這則推文，所以點讚動作失敗!')

      const user = await User.findByPk(tweet.User.id)
      if (!user) throw new Error('因為沒有推文作者，所以點讚動作失敗!')
      if (like) throw new Error('不能對同一則推文重複點讚!')

      // plus both totalLikes and totalLiked numbers each by 1,
      // and create like, and then return full like data from database
      const [_t, _u, responseData] = await Promise.all([
        tweet.increment('totalLikes', { by: 1 }),
        user.increment('totalLiked', { by: 1 }),
        Like.create({ UserId, TweetId }),
      ])

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  },

  postUnlike: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = Number(req.params.TweetId)

      const [tweet, like] = await Promise.all([
        Tweet.findOne({
          include: User,
          where: { id: TweetId }
        }),
        Like.findOne({
          where: { UserId, TweetId }
        })
      ])

      if (!tweet) throw new Error('因為沒有這則推文，所以收回讚的動作失敗!')

      const user = await User.findByPk(tweet.User.id)
      if (!user) throw new Error('因為沒有推文作者，所以收回讚的動作失敗!')
      if (!like) throw new Error('不能對尚未按讚的推文收回讚!')

      // minus both totalLikes and totalLiked numbers each by 1,
      // and destroy like, and then return full like data from database
      const [_t, _u, responseData] = await Promise.all([
        tweet.decrement('totalLikes', { by: 1 }),
        user.decrement('totalLiked', { by: 1 }),
        like.destroy(),
      ])

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  }
}