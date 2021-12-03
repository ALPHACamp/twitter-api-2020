const helpers = require('../_helpers')

const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetController = {
    getTweets: (req, res) => {
        Tweet.findAll({
            include: [
                User,
                Reply,
                Like
            ]
        }).then(tweets => {
            tweets.map(tweet => ({
                id: tweet.id,
                UserId: tweet.UserId,
                description: tweet.description,
                createdAt: tweet.createdAt,
                updatedAt: tweet.updatedAt,
            }))
            return res.json(tweets)
        })
    },
    getTweet: (req, res) => {
        return Tweet.findByPk(req.params.tweet_id, {
            include: [User, { model: Reply, include: [User] }]
        }).then(tweet => {
            return res.json(tweet)
        })
    },

    postTweet: (req, res) => {
        if (req.body.description.length > 140) {
            return res.json({ status: 'error', message: '字數最多 140 字' })
        }
        if (!req.body.description) {
            return res.json({ status: 'error', message: '內容不可空白' })
        } else {
            return Tweet.create({
                UserId: helpers.getUser(req).id,
                description: req.body.description
            })
                .then((tweet) => {
                    res.json({ status: 'success', message: '成功新增推文' })
                })
                .catch(error => console.log('error'))
        }
    },

    unlikeTweet: (req, res) => {
        Like.destroy({
            where: {
                UserId: helpers.getUser(req).id,
                TweetId: req.params.id
            }
        })
            .then(() => res.json({ status: 'success', message: '取消Like推文' }))
    },

    likeTweet: (req, res) => {
        Like.create({ UserId: helpers.getUser(req).id, TweetId: req.params.id })
            .then(like => {
                res.json({ status: 'success', message: '成功Like推文' })
            })
    },

    addReply: (req, res) => {
        if (req.body.comment.length > 200) {
            return res.json({ status: 'error', message: '字數最多 200 字' })
        }
        if (!req.body.comment) {
            return res.json({ status: 'error', message: '內容不可空白' })
        }
        return Reply.create({
            UserId: helpers.getUser(req).id,
            TweetId: req.params.tweet_id,
            comment: req.body.comment
        }).then(() => {
            res.json({ status: 'success', message: '成功新增回覆' })
        })
            .catch(error => console.log('error'))
    },

    getTweetReplies: (req, res) => {
        return Reply.findAll({
            where: { TweetId: req.params.tweet_id }
        })
            .then(Replies => {
                return res.json(Replies)
            })
    }
}
module.exports = tweetController