const db = require('../../models')
const helpers = require('../../_helpers')

const { Tweet, Reply, Like, User } = db

// @todo - add error handling

const tweetController = {
  getTweets: async (req, res) => {
    /* #swagger.tags = ['Tweet']
        #swagger.description = '瀏覽全部tweets'
        #swagger.responses[200] = {
          description: '回傳陣列帶有多個tweet物件',
          schema: [{"$ref": "#/definitions/Tweet"}]
        }
    */
    try {
      const tweets = await Tweet.findAll({
        include: [Reply, Like, User]
      })
      if (!tweets.length) {
        return res.status(400).json({ status: 'error', message: 'cannot find any tweet' })
      }
      return res.status(200).json(tweets)
    } catch (err) {
      res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },
  // @todo - add relationships
  getTweet: async (req, res) => {
    /* #swagger.tags = ['Tweet']
        #swagger.description = '瀏覽單一tweet'
        #swagger.responses[200] = {
          description: '回傳tweet物件',
          schema: {"$ref": "#/definitions/Tweet"}
        }
      #swagger.responses[400] = {
        description: '找不到tweet回傳error物件',
        schema: { status: 'error', message: 'tweet id does not exist' }
      }
    */
    try {
      const tweet = await Tweet.findByPk(req.params.id, {
        include: [Reply, Like, User]
      })

      if (!tweet) {
        return res.status(400).json({ status: 'error', message: 'tweet doesn\'t exist' })
      }
      return res.status(200).json(tweet)
    } catch (err) {
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },
  getReplies: async (req, res) => {
    /* #swagger.tags = ['Tweet']
        #swagger.description = '瀏覽單一tweet的全部replies'
        #swagger.responses[200] = {
          description: '回傳陣列帶有多個reply物件',
          schema: [{"$ref": "#/definitions/Reply"}]
        }
      #swagger.responses[400] = {
        description: '找不到tweet回傳error物件',
        schema: { status: 'error', message: 'tweet id does not exist' }
      }
    */
    try {
      const replies = await Reply.findAll({
        where: { TweetId: req.params.id }
      })
      if (!replies.length) {
        return res.status(400).json({ status: 'error', message: 'tweet doesn\'t exist' })
      }

      return res.status(200).json(replies)
    } catch (err) {
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },
  postTweet: async (req, res) => {
    /* #swagger.tags = ['Tweet']
      #swagger.description = '發表一篇新tweet'
      #swagger.parameters['description'] = {
            in: 'body',
            type: "object",
            description: "key=value: description=description",
            schema: {description: "description"},
            required: true
      }
        #swagger.responses[200] = {
          description: '回傳Success物件',
          schema: {"$ref": "#/definitions/SuccessMessage"}
        }
      #swagger.responses[400] = {
        description: '沒有提供description回傳erro物件',
        schema: { status: 'error', message: 'description is required' }
      }
    */
    try {
      const { description } = req.body
      if (!description) {
        // 400 = bad request
        return res.status(400).json({ status: 'error', message: 'description is required' })
      }
      const userId = helpers.getUser(req).id
      const tweet = await Tweet.create({
        UserId: userId,
        description
      })
      // discuss return success object or tweet
      return res.status(200).json({ status: 'success', message: 'Success' })
    } catch (err) {
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },
  postReply: async (req, res) => {
    /* #swagger.tags = ['Tweet']
      #swagger.description = '針對單一tweet發布一篇新reply'
      #swagger.parameters['description'] = {
            in: 'body',
            type: "object",
            description: "key=value: comment=comment",
            schema: {comment: "comment"},
            required: true
      }
        #swagger.responses[200] = {
          description: '回傳Success物件',
          schema: {"$ref": "#/definitions/SuccessMessage"}
        }
      #swagger.responses[400] = {
        description: '沒有提供comment回傳error物件',
        schema: { status: 'error', message: 'comment is required' }
      }
    */
    try {
      const { comment } = req.body
      const { tweetId } = req.params
      if (!comment) {
        return res.status(400).json({ status: 'error', message: 'comment is required' })
      }

      const userId = helpers.getUser(req).id
      const reply = await Reply.create({
        UserId: userId,
        TweetId: tweetId,
        comment
      })
      // discuss return success object or reply
      return res.status(200).json({ status: 'success', message: 'Success' })
    } catch (err) {
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },
  likeTweet: async (req, res) => {
    /* #swagger.tags = ['Tweet']
      #swagger.description = '喜歡一篇tweet'
        #swagger.responses[200] = {
          description: '回傳success物件',
          schema: {"$ref": "#/definitions/SuccessMessage"}
        }
      #swagger.responses[400] = {
        description: '如果tweet不存在, 或此使用者已經喜歡過此篇tweet則回傳error物件',
        schema: { status: 'error', message: 'tweet already liked by this user' }
      }
    */
    try {
      const { tweetId } = req.params
      const userId = helpers.getUser(req).id
      // check if tweet id exist
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) {
        return res.status(400).json({ status: 'error', message: 'tweet doesn\'t exist' })
      }
      // check if already liked
      const like = await Like.findOne({
        where: { UserId: userId, TweetId: tweetId }
      })
      if (like) {
        return res.status(400).json({ status: 'error', message: 'tweet already liked by this user' })
      }
      // create like
      await Like.create({
        UserId: userId,
        TweetId: tweetId
      })
      return res.status(200).json({ status: 'success', message: 'Success' })
    } catch (err) {
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },
  unlikeTweet: async (req, res) => {
    /* #swagger.tags = ['Tweet']
      #swagger.description = '取消喜歡一篇tweet'
        #swagger.responses[200] = {
          description: '回傳success物件',
          schema: {"$ref": "#/definitions/SuccessMessage"}
        }
      #swagger.responses[400] = {
        description: '如果tweet不存在, 或沒有喜歡紀錄則回傳error物件',
        schema: { status: 'error', message: 'no liked record or tweet not exist' }
      }
    */
    try {
      const { tweetId } = req.params
      const userId = helpers.getUser(req).id

      const like = await Like.findOne({
        where: { UserId: userId, TweetId: tweetId }
      })
      if (!like) {
        return res.status(400).json({ status: 'error', message: 'no liked record or tweet not exist' })
      }
      await like.destroy()
      return res.status(200).json({ status: 'success', message: 'Success' })
    } catch (err) {
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  }
}

module.exports = tweetController
