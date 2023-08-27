const { Tweet, User, Like, Reply, sequelize } = require('../models')
// const { getUser } = require('../_helpers')
const helpers = require('../_helpers')
const { relativeTimeFromNow, simpleDate, simpleTime } = require('../helpers/datetime-helper')

const tweetController = {
  // 看所有貼文
  getTweets: (req, res, next) => {
    const loginUserId = helpers.getUser(req).id
    return Tweet.findAll({
      nest: true,
      raw: true,
      include: {
        model: User,
        attributes: ['id', 'name', 'avatar', 'account']
      },
      attributes: [
        'id',
        'description',
        [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
        [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
        [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.UserId = ${loginUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
      ],
      order: [['createdAt', 'DESC']]
    })

    .then(data => {
      return data.map(tweet => ({
        ...tweet,
        createdAt : relativeTimeFromNow(tweet.createdAt)
      }))
    })

    .then(tweet => res.status(200).json({
      tweet,
      status: 'error',
      message: '推文不存在',
    }))
    .catch(err => next(err))
  },
  // 新增一筆貼文
  postTweet: (req, res, next) => {
    const limitWords = 140
    const { description } = req.body

    const loginUserId = helpers.getUser(req).id


    if (!loginUserId) throw new Error('帳號不存在！')
    if (!description.trim()) throw new Error('內容不可空白')
    if (description.length > limitWords ) throw new Error(`字數不能大於 ${limitWords} 字`)
    
    return Tweet.create({
      description,
      UserId: loginUserId
    })

    .then( tweet => {
      return res.status(200).json(tweet)

    })
    .catch(err => next(err))
  },
  // 瀏覽一筆貼文
  getTweet: (req, res, next) => {
    const loginUserId = helpers.getUser(req).id
    if (!loginUserId) throw new Error('帳號不存在！')

    return Tweet.findByPk(req.params.id, {
      include: 
        {
          model: User,
          attributes: ['id', 'name', 'avatar', 'account']
        },
      attributes: [
          'id',
          'createdAt',
          'description',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.UserId = ${loginUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
        ],
        raw: true,
        nest:true
    })
    .then(tweet => {
      if (!tweet) {
        return res.status(404).JSON({
          status: 'error',
          message: '推文不存在',
        })
      }

      tweet.createdAt = simpleTime(tweet.createdAt) + ' • ' + simpleDate(Tweet.createdAt)
      return res.status(200).json(tweet)   
    })
    .catch(err => next(err))
  },
  // 按讚一筆貼文
  likeTweet: (req, res, next) => {
    const TweetId = req.params.id
    const UserId = helpers.getUser(req).id

    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOrCreate({ // 陣列第 1 項回傳 true or false`, 沒資料就建立
        where: { UserId, TweetId}
      })
    ])
    .then(([tweet, like]) => {
        if (!tweet) {
          return res.status(404).json({
            status:'error',
            message: '推文不存在'
          })
        }
        if (!like[1]) {
        return res.status(422).json({
          status: 'error',
          message: '已表示喜歡'
          })
        }
        return res.status(200).json({ status: 'success' })

    })
    .catch(err => next(err))

    // way 2
      // Tweet.findByPk(TweetId, {
      //   attributes: {
      //     include: [[sequelize.literal(`EXISTS(SELECT true FROM Likes WHERE Likes.UserId = ${UserId} AND Likes.TweetId = ${TweetId})`), 'isLiked']],
      //     exclude: ['description', 'createdAt', 'updatedAt']
      //   },
      //   raw: true
      // })
      // .then(tweet => {
      //   if (!tweet) throw new Error('推文不存在')
      //   if (tweet.isLiked) throw new Error('You have liked this tweet!')
      //   return Like.create({
      //   UserId,
      //   TweetId
      //   })
      // })
      // .then(tweet => {tweet.isLiked = 1
      //   res.status(200).json(tweet)
      // })
  },
  // 對一筆貼文收回讚
  unlikeTweet: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.id

    Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) {
          return res.status(404).json({
            status: 'error',
            message: '推文不存在！'
          })
        }

        Like.destroy({ where: { UserId, TweetId } })
          .then(like => {
            if (!like) {
              return res.status(404).json({
                status: 'error',
                message: '未表示喜歡'
              })
            }
            return res.status(200).json({ status: 'success' })
          })
          .catch(err => {
            next(err)
          })
      })
      .catch(err => next(err))
      // way 2
    // const TweetId = req.params.id
    // const UserId = getUser(req).id

    // return Tweet.findByPk(TweetId, {
    //   attributes: {
    //     include: [[sequelize.literal(`EXISTS(SELECT true FROM Likes WHERE Likes.UserId = ${UserId} AND Likes.TweetId = ${TweetId})`), 'isLiked']],
    //     exclude: ['description', 'createdAt', 'updatedAt']
    //   },
    //   raw: true
    // })
    // .then(tweet => {
    //   if (!tweet) throw new Error('推文不存在')
    //   if (!tweet.isLiked) throw new Error("未表示喜歡")
    //   Like.destroy({ where: { TweetId, UserId }})
    //   return res.status(200).json({ status: 'success' })
    // })
    // .catch(err => next(err))
  },
  // 看貼文全部回覆
  getReplies: (req, res, next) => {
    const TweetId = req.params.id 
    return Reply.findAll({
        raw: true,
        nest: true,
        where: { TweetId },
        attributes: ['id', 'comment', 'createdAt'],
        include: {
          model: User,
          attributes: ['id', 'avatar', 'account', 'name']
        },
        order: [['createdAt', 'DESC'], ['id', 'ASC']]
      })
    .then(replies => replies.map( reply => ({
      ...reply,
      createdAt: relativeTimeFromNow(reply.createdAt)
    })))
    .then((data) => res.status(200).json(data))
    .catch(err => next(err))
  },
  // 回覆一筆貼文
  postReply: (req, res, next) => {
    const limitWords = 140
    const TweetId = req.params.id
    const UserId = helpers.getUser(req).id
    const { comment } = req.body

    return Tweet.findByPk(TweetId, {
      raw: true,
      nest: true,
    })
    .then(tweet => {
      if (!tweet) throw new Error('推文不存在')
      if (!comment.trim()) throw new Error('內容不可空白')
      if (comment.length > limitWords) throw new Error(`字數不能大於 ${limitWords} 字`)
      return Reply.create({
          comment,
          UserId,
          TweetId
        })
    })
    .then((data) => res.status(200).json(data))
    .catch(err => next(err))
  }
}

module.exports = tweetController
