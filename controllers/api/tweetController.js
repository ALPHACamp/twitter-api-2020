const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const db = require('../../models')
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const helpers = require('../../_helpers');

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [
        { model: Reply, as: 'replies' },
        { model: Like, as: 'likes' }
      ]
    }).then(tweets => {
      res.json({ tweets: tweets })
    })
  },
  getTweet: (req, res) => {
    return Promise.all([
      Tweet.findAndCountAll({
        include: [
          { model: Reply, as: 'replies' }
        ],
        where: { id: req.params.id }
      }),
      Tweet.findAndCountAll({
        include: [
          { model: Like, as: 'likes' }
        ],
        where: { id: req.params.id }
      })
    ]).then(([replies, likes]) => {
      res.json({ replyCount: replies.count, likeCount: likes.count })
    })
  },
  postTweet: (req, res) => {
    return Tweet.create({
      UserId: req.user.id,
      description: req.body.description
    }).then(tweet => {
      res.json({ status: 'success', message: 'Tweet was successfully posted', tweet: tweet })
      return res.redirect(`/tweets/${tweet.id}`)
    })
  },
  getReplies: (req, res) => {
    Tweet.findAll({
      include: [
        { model: Reply, as: 'replies' }
      ],
      where: { id: req.params.id }
    }).then(tweet => {
      res.json({ tweet: tweet })
    })
  },
}

module.exports = tweetController
