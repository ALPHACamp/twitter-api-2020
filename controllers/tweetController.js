const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const moment = require('moment')
const helpers = require('../_helpers')

let tweetController = {
  getTweets: (req, res) => {       //為了測試，先把req.user都換成helpers，但是postman會抓不到helper的東西
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, { model: User, as: 'LikedUsers' }, Reply, Like]
    }).then(tweets => {
      const data = tweets.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        tweetCreatedAt: moment(r.dataValues.createdAt).fromNow(),
        userName: r.User.name,
        userAvatar: r.User.avatar,
        userAccount: r.User.account,
        replyConut: r.Replies.length,
        likeConut: r.Likes.length,
        isLiked: r.LikedUsers.map(d => d.id).includes(req.user.id), //測試文件中helper無給定LikedTweets而抓不到 但因需用到map函式前面不得為undefined 故先改成從推文角度出發
        loginUserRole: req.user.role,  //測試文件中helper無給定role而抓不到
      }))
      return res.json(data)
    }).catch(err => console.log(err))
  },
  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      order: [[{ model: Reply }, 'createdAt', 'DESC']],
      include: [
        User,
        Like,
        { model: Reply, include: [User] },
        { model: User, as: 'LikedUsers' }
      ]
    }).then(tweet => {
      const isLiked = tweet.LikedUsers.map(d => d.id).includes(req.user.id)
      return res.json({
        tweet: tweet,
        description: tweet.description,
        replyConut: tweet.Replies.length,
        likeConut: tweet.Likes.length,
        tweetCreatedAt: moment(tweet.dataValues.createdAt).fromNow(),
        isLiked: isLiked
      })
    }).catch(err => console.log(err))
  },
  postTweet: (req, res) => {
    if (!req.body.description) {
      return res.json({ status: 'error', message: "貼文不能為空白" })
    } else if (req.body.description.length > 140) {
      return res.json({ status: 'error', message: "字數限制為140字以內" })
    } else {
      return Tweet.create({
        description: req.body.description,
        UserId: req.user.id
      })
        .then((tweet) => {
          return res.json({ status: 'success', message: '推文成功' })
        }).catch(err => console.log(err))
    }
  },
}
module.exports = tweetController