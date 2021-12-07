const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [
        // User,   // Tweet belongsTo User
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        { model: User, as: 'LikedUsers', attributes: ['id', 'name', 'account', 'avatar'] },    // Tweet belongsToMany User, through Like
        { model: User, as: 'RepliedUsers', attributes: ['id', 'name', 'account', 'avatar'] }   // Tweet belongsToMany User, through Reply; 包含Reply內容
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        tweets = tweets.map(tweet => ({
          ...tweet.dataValues,
          repliedCount: tweet.RepliedUsers.length,
          likedCount: tweet.LikedUsers.length
        }))
        tweets.forEach(tweet => {
          delete tweet.RepliedUsers
          delete tweet.LikedUsers
        })
        res.json(tweets)
      })
  },
  getTweet: (req, res) => {
    Tweet.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        { model: User, as: 'LikedUsers', attributes: ['id', 'name', 'account', 'avatar'] },
        { model: User, as: 'RepliedUsers', attributes: ['id', 'name', 'account', 'avatar'] }
      ]
    }).then(tweet => {
      tweet.dataValues.likedCount = tweet.LikedUsers.length
      tweet.dataValues.repliedCount = tweet.RepliedUsers.length
      return res.json(tweet)
    })
  },
  postTweet: (req, res) => {
    if (!req.body.description) {
      return res.json({ status: 'error', message: '內容不可空白' })
    }
    Tweet.create({
      description: req.body.description,
      UserId: helpers.getUser(req).id
    })
    return res.json({ status: 'success', message: "" })
  },
  getAdminTweets: (req, res) => {
    Tweet.findAll({
      include: User,
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      tweets = tweets.map(tweet => ({
        id: tweet.id,
        description50: tweet.description.slice(0, 50),
        createdAt: tweet.createdAt,
        User: tweet.User
      }))
      return res.json(tweets)
    })
  },
  deleteTweet: (req, res) => {
    Tweet.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(tweet => {
        console.log(tweet)
        if (tweet === 1) {  //確實有刪除成功
          return res.json({ status: 'success', message: '刪除成功' })
        } //tweet = 0 表示找不到推文
        return res.json({ status: 'error', message: '找不到推文' })
      })
  }
}

module.exports = tweetController