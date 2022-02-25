const { Tweet, User, Reply } = require('../models')
const helpers = require('../_helpers')


module.exports = {
  getTweets: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id 

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

        return {
          ...tweet,
          isLiked: usersFromLikedTweets.some(u => u.id === userId),
          tweetedUser
        }
      })

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  },

  getTweet: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const { TweetId } = req.params

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

      // delete original properties from tweet
      delete tweet.User
      delete tweet.UsersFromLikedTweets

      // reassemble tweet object
      const responseData = {
        ...tweet,
        isLiked: usersFromLikedTweets.some(u => u.id === userId),
        tweetedUser
      }

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  },

  postTweet: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const description = req.body.description?.trim() || null

      if (!description) throw new Error('推文不能為空!')
      if (description.length > 140) throw new Error('推文字數不能超過140字!')

      // create tweet, and then find full tweet data from database
      const tweet = await Tweet.create({ description, UserId: userId })
      const responseData = await Tweet.findByPk(tweet.id, { raw: true })

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  },

  getReplies: async (req, res, next) => {
    try {
      const { TweetId } = req.params

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

        // delete following object or property from reply
        delete reply.User
        delete repliedUser.password

        return { ...reply, repliedUser }
      })

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  },

  postReply: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const { TweetId } = req.params
      const comment = req.body.comment?.trim() || null

      if (!comment) throw new Error('回覆不能為空!')
      if (comment.length > 140) throw new Error('回覆字數不能超過140字!')

      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error('因為沒有這則推文，無法在其底下新增回覆!')

      // create reply, and then return full reply data from database
      const responseData = await Reply.create({ 
        comment, TweetId, UserId: userId 
      })

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  }
}