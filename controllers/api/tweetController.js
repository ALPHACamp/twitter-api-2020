const db = require('../../models')
const Tweet = db.Tweet
const Like = db.Like
const User = db.User
const defaultLimit = 10
//temp user ==> userId = 1
let currentUserId = 1

let tweetController = {
  getTweets: (req, res) => {
    let limit = req.query.limit || defaultLimit
    let offset = req.query.offset || 0
    const userAttr = ['id', 'account', 'name', 'avatar']
    const tweetAttr = ['id', 'description', 'likeNum', 'replyNum', 'createdAt']
    const order = [['createdAt', 'desc']]
    Like.findAll({
      raw: true,
      attributes: ['TweetId'],
      where: { UserId: currentUserId }
    }).then((userlike) => {
      Tweet.findAll({
        raw: true,
        nest: true,
        limit,
        offset,
        attributes: tweetAttr,
        order,
        include: [
          {
            model: User,
            attributes: userAttr
          }
        ]
      })
        .then((tweets) => {
          tweets = tweets.map((tweet) => ({
            id: tweet.id,
            description: tweet.description.substring(0, 50),
            isLike: userlike.some((like) => like.TweetId === tweet.id),
            likeNum: tweet.likeNum,
            replyNum: tweet.replyNum,
            createdAt: tweet.createdAt,
            User: tweet.User
          }))
          return res.status(200).json(tweets)
        })
        .catch(() => res.status(404).json({ status: 'error', message: '' }))
    })
  },
  getTweet: (req, res) => {
    const options = {
      attributes: ['id', 'description', 'likeNum', 'replyNum', 'createdAt', 'updatedAt', 'deletedAt', 'AdminId'],
      include: [
        { model: User, as: "User", attributes: ['id', 'account', 'name', 'avatar'] },
        {
          model: User, as: "LikedUsers", attributes: ['id'], through: {
            attributes: []
          }
        }
      ]
    }
    Tweet.findByPk(req.params.tweetId, options)
      .then(tweet => {
        tweet = tweet.toJSON();
        const { id, description, likeNum, replyNum, createdAt, updatedAt, deletedAt, AdminId, User } = tweet
        res.status(200).json({
          id,
          isLike: tweet.LikedUsers.some(user => user.id === currentUserId),
          description,
          likeNum,
          replyNum,
          createdAt,
          updatedAt,
          deletedAt,
          AdminId,
          User,
        })
      })
      .catch(() => res.status(404).json({ status: 'error', message: '' }))
  }
}

module.exports = tweetController
