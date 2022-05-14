const { Tweet, User, Reply } = require('../models')
const { getUser } = require('../_helpers')

const tweetController = {

  getTweets: (req, res, next) => {
    // 為節省重新重資料庫拉資料的時間，getTweets直接用資料的likeCount和replyCount做數字顯示。但為確保數字正確。會在讀取單筆tweet資料的controller中，重拉資料並計數
    Tweet.findAll({
      attributes: ['id', 'description', 'createdAt', 'updatedAt', 'replyCount', 'likeCount'],
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] }
      ],
      raw: true,
      nest: true
    })
      .then(tweets => {
        const likedTweetId = getUser(req)?.LikedTweets ? getUser(req).LikedTweets.map(t => t.id) : []
        const data = tweets.map(tweet => ({
          ...tweet,
          isLiked: likedTweetId.some(item => item === tweet.id)
        }))

        // res.status(200).json({ status: 'success', data }) 這樣寫測試過不了
        res.status(200).json(data)
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
        const likedTweetId = getUser(req)?.LikedTweets ? getUser(req).LikedTweets.map(t => t.id) : []
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
    const UserId = Number(getUser(req).id)
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
    const UserId = Number(getUser(req).id)
    const TweetId = Number(req.params.TweetId)
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
  }

}

module.exports = tweetController
