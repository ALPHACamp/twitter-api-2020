const { Tweet, User, Reply, Like } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [User, Reply, Like],
      order: [['createdAt', 'DESC']]
    })
      .then(tweetsData => {
        const tweets = tweetsData.map(tweet => ({
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          updatedAt: tweet.updatedAt,
          replyNum: tweet.Replies.length,
          likeNum: tweet.Likes.length,
          isLiked: tweet.Likes.some(like => like.UserId === req.user.id),
          user: {
            name: tweet.User.name,
            account: tweet.User.account,
            image: tweet.User.image
          }
        }))
        console.log(tweets.description)
        console.log(tweets)
        return res.status(200).json({ data: tweets })
      })
      .catch(error => next(error))
  },
  postTweet: (req, res, next) => {
    const { description } = req.body
    const UserId = req.user.id
    if (!description.trim()) throw new Error('內容不可空白')
    if (description.length > 140) throw new Error('推文的字數超過上限 140 個字!')
    return User.findByPk(UserId)
      .then(user => {
        if (!user) throw new Error('使用者不存在')
        return Tweet.create({
          UserId,
          description
        })
      })
      .then(newTweet => {
        res.status(200).json({
          status: 'success',
          message: '新增推文成功',
          data: newTweet
        })
      })
      .catch(error => next(error))
  },
  getTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id, { include: [User, Like, Reply] })
      .then(tweetData => {
        if (!tweetData) throw new Error('推文不存在')
        const tweet = {
          id: tweetData.id,
          UserId: tweetData.UserId,
          description: tweetData.description,
          createdAt: tweetData.createdAt,
          updatedAt: tweetData.updatedAt,
          replyNum: tweetData.Replies.length,
          likeNum: tweetData.Likes.length,
          isLiked: tweetData.Likes.some(like => like.UserId === req.user.id),
          user: {
            name: tweetData.User.name,
            account: tweetData.User.account,
            image: tweetData.User.image
          }
        }
        console.log(tweet.description)
        console.log(tweet)
        return res.status(200).json({ data: tweet })
      })
      .catch(error => next(error))
  }
}

module.exports = tweetController
