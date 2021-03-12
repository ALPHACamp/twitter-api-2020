const db = require('../../models')
const helpers = require('../../_helpers')

const { Tweet, Reply, Like, User } = db

const tweetController = {
  getTweets: async (req, res) => {
    /* #swagger.tags = ['Tweet']
        #swagger.description = '瀏覽全部使用者有追蹤的tweets以及自己的tweets'
        #swagger.responses[200] = {
          description: '回傳陣列帶有多個tweet物件',
          schema: [{"$ref": "#/definitions/Tweet"}]
        }
        #swagger.responses[400] = {
          description: '如果找不到資料回傳error物件',
          schema: { status: 'error', message: 'cannot find any tweet' }
        }
    */
    try {
      const currentUser = JSON.parse(JSON.stringify(helpers.getUser(req)))
      const followingIds = currentUser.Followings.map(followings => followings.id)
      const tweets = await Tweet.findAll({
        where: {
          UserId: [currentUser.id, ...followingIds] // WHERE tweets.UserId IN [21,31...]
        },
        include: [
          { model: Reply, include: { model: User, attributes: { exclude: ['password'] } } },
          Like,
          { model: User, attributes: { exclude: ['password'] } }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!tweets || !Array.isArray(tweets)) {
        return res.status(400).json({ status: 'error', message: 'cannot find any tweet' })
      }
      const tweetsData = tweets.map(tweet => {
        const ifLike = tweet.Likes.map(like => like.UserId).includes(helpers.getUser(req).id)
        tweet = JSON.parse(JSON.stringify(tweet))
        return Object.assign(tweet, { isLikedByMe: ifLike })
      })
      return res.status(200).json(tweetsData)
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  },
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
      // findByPk can take options.include, but not .where (both not mentioned in doc)
      const tweet = await Tweet.findByPk(req.params.id, {
        include: [
          { model: Reply, include: { model: User, attributes: { exclude: ['password'] } } },
          Like,
          { model: User, attributes: { exclude: ['password'] } }
        ]
      })

      if (!tweet) {
        return res.status(400).json({ status: 'error', message: 'tweet doesn\'t exist' })
      }
      // check if current user liked this post, if yes, isLikedByMe = true
      const ifLike = tweet.Likes.map(like => like.UserId).includes(helpers.getUser(req).id)
      const tweetData = Object.assign(tweet.toJSON(), { isLikedByMe: ifLike })

      return res.status(200).json(tweetData)
    } catch (err) {
      console.log(err)
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
        where: { TweetId: req.params.id },
        order: [['createdAt', 'DESC']]
      })
      if (!replies.length) {
        return res.status(400).json({ status: 'error', message: 'tweet doesn\'t exist' })
      }

      return res.status(200).json(replies)
    } catch (err) {
      console.log(err)
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
      await Tweet.create({
        UserId: userId,
        description
      })

      return res.status(200).json({ status: 'success', message: 'Success' })
    } catch (err) {
      console.log(err)
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
      await Reply.create({
        UserId: userId,
        TweetId: tweetId,
        comment
      })

      return res.status(200).json({ status: 'success', message: 'Success' })
    } catch (err) {
      console.log(err)
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
      console.log(err)
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
      console.log(err)
      return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
    }
  }
}

module.exports = tweetController
