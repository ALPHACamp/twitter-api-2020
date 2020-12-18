const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const userController = {
  readUser: (req, res) => {
    const id = Number(req.params.id)
    User.findOne({
      where: { id },
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ]
    }).then(user => {
      if (!user) return res.status(404).json({
        message: `this user(id: ${id}) do not exist!`
      })

      const userObj = Object.fromEntries(Object.entries(user.toJSON()).slice(0, 11))
      userObj.isSelf = (user.id === req.user.id)
      userObj.isFollowed = user.Followers.map(follower => follower.id).includes(helpers.getUser(req).id)
      userObj.tweetsCount = user.Tweets.length
      userObj.followingsCount = user.Followings.length
      userObj.followersCount = user.Followers.length
      return res.json(userObj)
    }).catch(err => console.error(err))
  },
  readTweets: (req, res) => {
    const UserId = Number(req.params.id)
    Tweet.findAll({
      where: { UserId },
      order: [['createdAt', 'DESC']],
      include: [Reply, Like]
    }).then(tweets => {
      tweets = tweets.map(tweet => ({
        ...(Object.fromEntries(Object.entries(tweet.dataValues).slice(0, 5))),
        repliesCount: tweet.dataValues.Replies.length,
        likesCount: tweet.dataValues.Likes.length,
        isLike: tweet.dataValues.Likes.map(like => like.UserId).includes(helpers.getUser(req).id)
      }))
      return res.json(tweets)
    }).catch(err => console.error(err))
  },
  readRepliedTweets: (req, res) => {
    const UserId = Number(req.params.id)
    Reply.findAll({
      where: { UserId },
      sort: [['createdAt', 'DESC']],
      include: [{
        model: Tweet,
        required: true, // INNER JOIN to select not null record
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['id', 'UserId'] }
        ]
      }]
    }).then(replies => {
      replies = replies.map(reply => ({
        ...(Object.fromEntries(Object.entries(reply.dataValues).slice(0, 7))),
        Tweet: { ...(Object.fromEntries(Object.entries(reply.dataValues.Tweet.dataValues).slice(0, 6))) },
        repliesCount: reply.Tweet.Replies.length,
        likesCount: reply.Tweet.Likes.length,
        isLike: reply.Tweet.Likes.map(like => like.UserId).includes(helpers.getUser(req).id)
      }))
      return res.json(replies)
    }).catch(err => console.error(err))
  },
  readLikes: (req, res) => {
    const UserId = Number(req.params.id)
    Like.findAll({
      where: { UserId },
      sort: [['createdAt', 'DESC']],
      include: [{
        model: Tweet, include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
          { model: Reply, attributes: ['id'] },
          { model: Like, attributes: ['id', 'UserId'] }
        ]
      }]
    }).then(likes => {
      likes = likes.map(like => ({
        ...(Object.fromEntries(Object.entries(like.dataValues).slice(0, 5))),
        Tweet: { ...(Object.fromEntries(Object.entries(like.dataValues.Tweet.dataValues).slice(0, 6))) },
        repliesCount: like.Tweet.Replies.length,
        likesCount: like.Tweet.Likes.length,
        isLike: like.Tweet.Likes.map(like => like.UserId).includes(helpers.getUser(req).id)
      }))
      return res.json(likes)
    }).catch(err => console.error(err))
  },
  readFollowings: (req, res) => {

  },
  readFollowers: (req, res) => {

  },
  updateUser: (req, res) => {

  }
}

module.exports = userController
